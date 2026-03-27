import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/portfolio/"],
        disallow: ["/builder", "/preview", "/messages", "/api/", "/auth/"],
      },
    ],
    sitemap: "https://portfolio-builder-alpha-topaz.vercel.app/sitemap.xml",
  };
}
