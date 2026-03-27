import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://portfolio-builder-alpha-topaz.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use anon key — SELECT on published portfolios is publicly allowed via RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: portfolios } = await supabase
    .from("portfolios")
    .select("user_id, updated_at")
    .eq("is_published", true);

  const portfolioEntries: MetadataRoute.Sitemap = (portfolios ?? []).map((p) => ({
    url: `${BASE_URL}/portfolio/${p.user_id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...portfolioEntries,
  ];
}
