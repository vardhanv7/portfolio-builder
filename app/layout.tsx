import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-builder-alpha-topaz.vercel.app"),
  title: {
    default: "PortfolioBuilder — Create Your Professional Portfolio in Minutes",
    template: "%s — PortfolioBuilder",
  },
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
  openGraph: {
    siteName: "PortfolioBuilder",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Replace PLACEHOLDER_VERIFICATION_CODE with your actual code from
  // Google Search Console → Settings → Ownership verification → HTML tag method
  verification: {
    google: "r_vTz2GdEMqF_hhkw2KY5UiAMi5ePHELlxEoacJJBiI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
