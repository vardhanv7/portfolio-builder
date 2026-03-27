import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview Templates",
  description: "Preview and customise your portfolio template before publishing.",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
