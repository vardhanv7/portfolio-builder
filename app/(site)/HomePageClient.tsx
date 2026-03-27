"use client";

import Link from "next/link";
import { Globe, Layers, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { templateRegistry } from "@/templates";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    Icon: Globe,
    title: "Public URL",
    description:
      "Your portfolio is a shareable public link. No hosting setup needed.",
  },
  {
    Icon: Layers,
    title: "3 Templates",
    description:
      "Modern, Minimal, or Creative. Switch anytime from the preview page.",
  },
  {
    Icon: Zap,
    title: "HTML Export",
    description:
      "Download a self-contained HTML file to host anywhere you like.",
  },
];

const TEMPLATE_ACCENTS: Record<string, string> = {
  modern: "bg-zinc-900",
  minimal: "bg-gray-100 border-b",
  creative: "bg-violet-950",
};

const TEMPLATE_ORDER = ["modern", "minimal", "creative"] as const;

export default function HomePageClient() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex-1 bg-gradient-to-b from-zinc-50 to-white px-6 py-24 md:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Build your portfolio
            <br />
            <span className="text-primary">in minutes</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Fill out your details, pick a template, and get a shareable public
            URL — no coding required.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started Free
            </Link>
            <Link
              href="/builder"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Open Builder
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-semibold text-gray-900">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {FEATURES.map(({ Icon, title, description }) => (
              <div key={title} className="flex flex-col items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Template Showcase ─────────────────────────────────────────────── */}
      <section className="bg-zinc-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-semibold text-gray-900">
            Three templates, one builder
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {TEMPLATE_ORDER.map((id) => {
              const config = templateRegistry[id];
              return (
                <div
                  key={id}
                  className="overflow-hidden rounded-xl border bg-white"
                >
                  <div className={cn("h-3 w-full", TEMPLATE_ACCENTS[id])} />
                  <div className="p-5">
                    <p className="font-semibold text-gray-900">{config.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {config.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t bg-white px-6 py-8 text-center text-sm text-muted-foreground">
        © {year} Portfolio Builder
      </footer>
    </div>
  );
}
