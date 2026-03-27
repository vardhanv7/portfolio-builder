import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioData } from "@/types/portfolio";

// ── Rate limiting ─────────────────────────────────────────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) rateLimitMap.delete(key);
  }
}, 60_000);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count += 1;
  return false;
}

// ── Validation ────────────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  portfolioUserId: z.string().uuid().optional(),
  // honeypot — must be empty
  _hp: z.string().max(0).optional(),
});

// ── POST /api/contact ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // IP extraction
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const { name, email, subject, message, portfolioUserId, _hp } = parsed.data;

  // Honeypot — bots fill hidden fields
  if (_hp) {
    return NextResponse.json({ data: "ok" }); // silently discard
  }

  if (!portfolioUserId) {
    return NextResponse.json(
      { error: "Portfolio owner not specified" },
      { status: 400 }
    );
  }

  // ── Look up portfolio owner's contact email ─────────────────────────────────
  const supabase = await createClient();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("contact, user_id")
    .eq("user_id", portfolioUserId)
    .eq("is_published", true)
    .single();

  if (!portfolio) {
    return NextResponse.json(
      { error: "Portfolio not found" },
      { status: 404 }
    );
  }

  const ownerEmail = (portfolio.contact as PortfolioData["contact"] | null)
    ?.email;

  if (!ownerEmail) {
    return NextResponse.json(
      { error: "Portfolio owner has no contact email configured" },
      { status: 422 }
    );
  }

  // ── Send email via Resend ───────────────────────────────────────────────────
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error: sendError } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: ownerEmail,
    replyTo: email,
    subject: `New message from ${name} via your portfolio`,
    html: `
      <h2 style="font-family:sans-serif;color:#111">New Contact Form Message</h2>
      <table style="font-family:sans-serif;font-size:14px;color:#444;border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;font-weight:600">Name</td><td>${esc(name)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:600">Email</td><td><a href="mailto:${esc(email)}" style="color:#2563eb">${esc(email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:600">Subject</td><td>${esc(subject)}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:14px;color:#444;font-weight:600;margin-top:16px">Message</p>
      <p style="font-family:sans-serif;font-size:14px;color:#444;white-space:pre-wrap">${esc(message)}</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
      <p style="font-family:sans-serif;font-size:12px;color:#999"><em>Hit Reply to respond directly to ${esc(name)} at ${esc(email)}. Sent via Portfolio Builder.</em></p>
    `,
  });

  if (sendError) {
    console.error("[contact] Resend error:", sendError);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: "ok" });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
