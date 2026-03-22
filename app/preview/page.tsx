"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Copy, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import TemplatePreviewCard from "@/components/shared/TemplatePreviewCard";
import { ModernTemplate, MinimalTemplate, CreativeTemplate, templateRegistry } from "@/templates";
import { createClient } from "@/lib/supabase/client";
import { usePortfolioStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PortfolioData } from "@/types/portfolio";

type TemplateName = "modern" | "minimal" | "creative";

const TEMPLATE_MAP = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
} as const;

const TEMPLATE_ORDER: TemplateName[] = ["modern", "minimal", "creative"];

export default function PreviewPage() {
  const { portfolioData, setFullData, setIsSaved } = usePortfolioStore();

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>("modern");
  const [userId, setUserId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  // ── Load user + portfolio on mount ─────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) setUserId(user.id);

        const res = await fetch("/api/portfolio");
        const json = (await res.json()) as {
          data: (PortfolioData & { template_name: string | null; is_published: boolean | null }) | null;
          error: string | null;
        };

        if (json.data) {
          const savedTemplate = json.data.template_name as TemplateName | undefined;
          if (savedTemplate && TEMPLATE_ORDER.includes(savedTemplate)) {
            setSelectedTemplate(savedTemplate);
          }

          // Populate store from API only if it's empty (page refresh)
          if (!portfolioData.personal.name) {
            setFullData({
              personal: json.data.personal,
              skills: json.data.skills,
              projects: json.data.projects,
              experience: json.data.experience,
              education: json.data.education,
              social: json.data.social,
              contact: json.data.contact,
            });
          }

          if (json.data.is_published === true) {
            setIsPublished(true);
          }
        }
      } catch {
        toast.error("Failed to load portfolio data");
      } finally {
        setDataReady(true);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Publish ────────────────────────────────────────────────────────────────
  async function handlePublish() {
    setIsPublishing(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_name: selectedTemplate,
          is_published: true,
        }),
      });
      if (!res.ok) throw new Error("Publish failed");
      setIsPublished(true);
      setIsSaved(true);
      toast.success("Portfolio published!");
    } catch {
      toast.error("Failed to publish. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/portfolio/${userId}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  }

  const publicUrl = userId ? `/portfolio/${userId}` : null;
  const TemplateComponent = TEMPLATE_MAP[selectedTemplate];
  const selectedConfig = templateRegistry[selectedTemplate];

  // ── Success state ──────────────────────────────────────────────────────────
  if (isPublished && publicUrl) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
            <div className="text-5xl">🎉</div>
            <div>
              <h1 className="text-2xl font-bold">Your portfolio is live!</h1>
              <p className="mt-2 text-muted-foreground">Share it with the world.</p>
            </div>

            {/* URL display */}
            <div className="w-full rounded-lg border bg-muted px-4 py-3 text-sm font-mono break-all text-center">
              {typeof window !== "undefined" ? window.location.origin : ""}
              {publicUrl}
            </div>

            {/* Primary actions */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="mr-2 size-4" />
                Copy Link
              </Button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <ExternalLink className="mr-2 size-4" />
                View Portfolio
              </a>
            </div>

            <Separator />

            {/* Secondary actions */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/builder"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                <ArrowLeft className="mr-2 size-4" />
                Edit Builder
              </Link>
              <Button variant="ghost" onClick={() => setIsPublished(false)}>
                Change Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Preview / select state ─────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Preview Your Portfolio</h1>
          <p className="mt-1 text-muted-foreground">
            Choose a template, then publish to get your public URL.
          </p>
        </div>
        <Link
          href="/builder"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0")}
        >
          <ArrowLeft className="mr-1.5 size-4" />
          Edit
        </Link>
      </div>

      {/* Template selector */}
      {dataReady ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          {TEMPLATE_ORDER.map((id) => {
            const config = templateRegistry[id];
            return (
              <TemplatePreviewCard
                key={id}
                id={id}
                name={config.name}
                description={config.description}
                selected={selectedTemplate === id}
                onSelect={() => setSelectedTemplate(id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      <Separator className="mb-6" />

      {/* Live preview */}
      {dataReady ? (
        <div className="rounded-xl border overflow-auto max-h-[70vh] bg-white">
          <TemplateComponent data={portfolioData} />
        </div>
      ) : (
        <Skeleton className="h-[70vh] rounded-xl" />
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t">
        <Link
          href="/builder"
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <ArrowLeft className="mr-1.5 size-4" />
          Edit Portfolio
        </Link>

        <Button onClick={handlePublish} disabled={isPublishing || !dataReady}>
          {isPublishing ? (
            "Publishing…"
          ) : (
            <>
              Publish with {selectedConfig?.name ?? selectedTemplate}
              <ArrowRight className="ml-1.5 size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
