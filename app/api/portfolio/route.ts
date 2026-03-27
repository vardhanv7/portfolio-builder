import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod schema — all portfolio sections are optional on upsert so users can
// save partial progress through the multi-step builder.
//
// NOTE: Do NOT add .min(1) or .url() constraints here. This is a progressive-
// save API — fields like bio, project titles, and descriptions are legitimately
// empty while the user is still filling them in. Format validation belongs in
// the UI forms, not in the persistence layer. Tightening these schemas causes
// auto-save to fail mid-session with 422 errors.
// ---------------------------------------------------------------------------
const personalSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string().optional(),
  bio: z.string(),         // optional in UI — may be "" during editing
  avatar: z.string().optional(),
});

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional(),
  level: z.number().int().min(1).max(5).optional(),
});

const projectSchema = z.object({
  title: z.string(),       // new project cards start with ""
  description: z.string(), // optional in UI — may be "" during editing
  techStack: z.array(z.string()),
  url: z.string().optional(),       // URL format checked in UI, not here
  githubUrl: z.string().optional(),
  image: z.string().optional(),
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
  // No .url() — users may type partial URLs ("github.com/user") or empty
  // strings before completing them. Format validation is in the UI.
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
});

const contactSchema = z.object({
  email: z.string(),       // validated in UI; may be "" for new users on first save
  location: z.string().optional(),
});

const themeSchema = z.object({
  mode: z.enum(["single", "combination"]),
  primary: z.string(),
  secondary: z.string(),
  preset: z.string().nullable(),
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
  avatar_url: z.string().nullable().optional(),
  theme: themeSchema.optional(),
  section_order: z.array(z.string()).optional(),
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
    // PGRST116 = row not found — fine for new users who haven't saved yet
    console.error("[GET /api/portfolio] Supabase error:", error.code, error.message);
    return NextResponse.json({ data: null, error: "Failed to fetch portfolio" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ data: null, error: null });
  }

  // Map DB column section_order → sectionOrder for the client
  const { section_order, ...rest } = data;
  return NextResponse.json({
    data: { ...rest, sectionOrder: section_order ?? [] },
    error: null,
  });
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
    if (authError) {
      console.error("[POST /api/portfolio] Auth error:", authError.message);
    }
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
    const flat = parsed.error.flatten();
    console.error("[POST /api/portfolio] Zod validation failed:", JSON.stringify(flat));
    return NextResponse.json(
      { data: null, error: "Validation failed", details: flat },
      { status: 422 }
    );
  }

  const { section_order, ...parsedRest } = parsed.data;

  const { data, error } = await supabase
    .from("portfolios")
    .upsert(
      {
        ...parsedRest,
        ...(section_order !== undefined ? { section_order } : {}),
        user_id: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error(
      "[POST /api/portfolio] Supabase upsert error:",
      error.code,
      error.message,
      error.details,
      error.hint
    );
    return NextResponse.json(
      { data: null, error: "Failed to save portfolio", code: error.code },
      { status: 500 }
    );
  }

  return NextResponse.json({ data, error: null });
}
