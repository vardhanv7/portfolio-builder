import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod schema — all portfolio sections are optional on upsert so users can
// save partial progress through the multi-step builder.
// ---------------------------------------------------------------------------
const personalSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  avatar: z.string().url().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  level: z.number().int().min(1).max(5).optional(),
});

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()),
  url: z.string().url().optional(),
  image: z.string().url().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  description: z.string().min(1),
});

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  year: z.string().min(1),
});

const socialSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  website: z.string().url().optional(),
});

const contactSchema = z.object({
  email: z.string().email(),
  location: z.string().optional(),
});

const portfolioUpsertSchema = z.object({
  template_name: z.enum(["modern", "minimal", "creative"]).optional(),
  personal: personalSchema.optional(),
  skills: z.array(skillSchema).optional(),
  projects: z.array(projectSchema).optional(),
  experience: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  social: socialSchema.optional(),
  contact: contactSchema.optional(),
  is_published: z.boolean().optional(),
});

// ---------------------------------------------------------------------------
// GET /api/portfolio — fetch the authenticated user's portfolio
// ---------------------------------------------------------------------------
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = row not found, which is fine for new users
    return NextResponse.json({ data: null, error: "Failed to fetch portfolio" }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? null, error: null });
}

// ---------------------------------------------------------------------------
// POST /api/portfolio — upsert the authenticated user's portfolio
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ data: null, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ data: null, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = portfolioUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { data: null, error: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { data, error } = await supabase
    .from("portfolios")
    .upsert(
      { ...parsed.data, user_id: user.id, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ data: null, error: "Failed to save portfolio" }, { status: 500 });
  }

  return NextResponse.json({ data, error: null });
}
