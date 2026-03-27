import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

const BASE_URL = "https://portfolio-builder-alpha-topaz.vercel.app";

export const metadata: Metadata = {
  title: "PortfolioBuilder — Create Your Professional Portfolio in Minutes",
  description:
    "Build and publish your professional portfolio for free in minutes. Choose from 3 beautiful templates and get a shareable public URL — no coding required.",
  keywords: [
    "portfolio builder",
    "free portfolio",
    "developer portfolio",
    "personal website",
    "online portfolio",
    "portfolio maker",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "PortfolioBuilder — Create Your Professional Portfolio in Minutes",
    description:
      "Build and publish your professional portfolio for free in minutes. Choose from 3 beautiful templates and get a shareable public URL — no coding required.",
    url: BASE_URL,
    siteName: "PortfolioBuilder",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PortfolioBuilder — Create Your Professional Portfolio in Minutes",
    description:
      "Build and publish your professional portfolio for free in minutes. Choose from 3 beautiful templates and get a shareable public URL — no coding required.",
  },
};

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PortfolioBuilder",
  description:
    "Create your professional portfolio website in minutes — free, with 3 beautiful templates",
  url: BASE_URL,
  applicationCategory: "DesignApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  operatingSystem: "Web",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <HomePageClient />
    </>
  );
}
