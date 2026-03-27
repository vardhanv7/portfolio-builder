import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ModernTemplate, MinimalTemplate, CreativeTemplate } from "@/templates";
import type { PortfolioData, ThemeConfig } from "@/types/portfolio";

export const revalidate = 60;

const BASE_URL = "https://portfolio-builder-alpha-topaz.vercel.app";

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

  const personal = data?.personal as { name?: string; title?: string; bio?: string } | null;
  const name = personal?.name ?? "Portfolio";
  const title = personal?.title ?? "";
  const bio = personal?.bio ?? "";

  const canonicalUrl = `${BASE_URL}/portfolio/${userId}`;
  const description = bio
    ? bio.length > 155
      ? bio.slice(0, 152) + "..."
      : bio
    : `View ${name}'s portfolio${title ? ` — ${title}` : ""}`;

  return {
    title: `${name} — Portfolio`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${name} — Portfolio`,
      description,
      url: canonicalUrl,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Portfolio`,
      description,
    },
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
    sectionOrder: (portfolio.section_order as string[]) ?? [],
    avatar_url: (portfolio.avatar_url as string | null) ?? undefined,
  };

  const theme = (portfolio.theme as ThemeConfig) ?? undefined;
  const templateName = ((portfolio.template_name as string) ?? "modern") as TemplateName;
  const TemplateComponent = TEMPLATE_MAP[templateName] ?? ModernTemplate;
  const sectionOrder = (portfolio.section_order as string[] | null) ?? undefined;

  const canonicalUrl = `${BASE_URL}/portfolio/${userId}`;

  // ── JSON-LD structured data ──────────────────────────────────────────────────

  const { personal, social, contact, skills } = portfolioData;

  const sameAs = [
    social.github,
    social.linkedin,
    social.twitter,
    social.website,
  ].filter((url): url is string => !!url && url.trim().length > 0);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personal.name,
    ...(personal.title ? { jobTitle: personal.title } : {}),
    ...(personal.bio ? { description: personal.bio } : {}),
    url: canonicalUrl,
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(skills.length > 0 ? { knowsAbout: skills.map((s) => s.name) } : {}),
    ...(contact.email ? { email: contact.email } : {}),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${personal.name}'s Portfolio`,
    ...(personal.bio ? { description: personal.bio } : {}),
    url: canonicalUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <TemplateComponent
        data={portfolioData}
        theme={theme}
        sectionOrder={sectionOrder}
        portfolioUserId={userId}
      />
    </>
  );
}
