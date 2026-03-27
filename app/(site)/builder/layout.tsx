import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Portfolio",
  description: "Fill in your details step by step and publish your professional portfolio.",
  robots: { index: false, follow: false },
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
