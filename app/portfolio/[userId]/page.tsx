import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ModernTemplate, MinimalTemplate, CreativeTemplate } from "@/templates";
import type { PortfolioData } from "@/types/portfolio";

export const revalidate = 60;

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
} as const;

type TemplateName = keyof typeof TEMPLATE_MAP;

interface PageProps {
  params: Promise<{ userId: string }>;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("portfolios")
    .select("personal")
    .eq("user_id", userId)
    .eq("is_published", true)
    .single();

  const name =
    (data?.personal as { name?: string } | null)?.name ?? "Portfolio";

  return {
    title: `${name} — Portfolio`,
    description: `View ${name}'s portfolio`,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function PortfolioPage({ params }: PageProps) {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", userId)
    .eq("is_published", true)
    .single();

  if (!portfolio) notFound();

  // Reconstruct typed PortfolioData from JSONB columns
  const portfolioData: PortfolioData = {
    personal: (portfolio.personal as PortfolioData["personal"]) ?? {
      name: "",
      title: "",
      bio: "",
    },
    skills: (portfolio.skills as PortfolioData["skills"]) ?? [],
    projects: (portfolio.projects as PortfolioData["projects"]) ?? [],
    experience: (portfolio.experience as PortfolioData["experience"]) ?? [],
    education: (portfolio.education as PortfolioData["education"]) ?? [],
    social: (portfolio.social as PortfolioData["social"]) ?? {},
    contact: (portfolio.contact as PortfolioData["contact"]) ?? { email: "" },
  };

  const templateName = ((portfolio.template_name as string) ?? "modern") as TemplateName;
  const TemplateComponent = TEMPLATE_MAP[templateName] ?? ModernTemplate;

  return <TemplateComponent data={portfolioData} />;
}
