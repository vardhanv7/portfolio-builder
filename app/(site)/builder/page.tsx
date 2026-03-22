"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Check, ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { usePortfolioStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PortfolioData } from "@/types/portfolio";
import PersonalInfoStep from "./components/PersonalInfoStep";
import SkillsStep from "./components/SkillsStep";
import ProjectsStep from "./components/ProjectsStep";
import ExperienceStep from "./components/ExperienceStep";

// ── Types ──────────────────────────────────────────────────────────────────

interface PortfolioApiData extends PortfolioData {
  template_name: string | null;
  is_published: boolean | null;
}

interface PortfolioApiResponse {
  data: PortfolioApiData | null;
  error: string | null;
}

interface PortfolioStatus {
  isPublished: boolean;
  templateName: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const STEP_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "Personal Info",
  2: "Skills",
  3: "Projects",
  4: "Experience",
};

const STEP_COMPONENTS: Record<1 | 2 | 3 | 4, React.ComponentType> = {
  1: PersonalInfoStep,
  2: SkillsStep,
  3: ProjectsStep,
  4: ExperienceStep,
};

// ── Page ───────────────────────────────────────────────────────────────────

export default function BuilderPage() {
  const router = useRouter();
  const hydrated = useRef(false);

  const {
    portfolioData,
    currentStep,
    isLoading,
    isSaved,
    setStep,
    setFullData,
    setIsLoading,
    setIsSaved,
  } = usePortfolioStore();

  const [dataReady, setDataReady] = useState(false);
  const [portfolioStatus, setPortfolioStatus] = useState<PortfolioStatus | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ── Load user + portfolio on mount ────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        // Fetch userId in parallel with portfolio data
        const supabase = createClient();
        const [
          {
            data: { user },
          },
          res,
        ] = await Promise.all([supabase.auth.getUser(), fetch("/api/portfolio")]);

        if (user) setUserId(user.id);

        if (res.status === 401) {
          router.push("/login?error=session_expired");
          return;
        }

        const json = (await res.json()) as PortfolioApiResponse;

        if (json.data) {
          setFullData({
            personal: json.data.personal,
            skills: json.data.skills,
            projects: json.data.projects,
            experience: json.data.experience,
            education: json.data.education,
            social: json.data.social,
            contact: json.data.contact,
          });

          setPortfolioStatus({
            isPublished: json.data.is_published ?? false,
            templateName: json.data.template_name ?? "modern",
          });
        }
      } catch {
        toast.error("Failed to load portfolio data");
      } finally {
        hydrated.current = true;
        setDataReady(true);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-save with 500ms debounce ─────────────────────────────────────────
  useEffect(() => {
    if (!hydrated.current) return;
    setIsSaved(false);

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            personal: portfolioData.personal,
            skills: portfolioData.skills,
            projects: portfolioData.projects,
            experience: portfolioData.experience,
            education: portfolioData.education,
            social: portfolioData.social,
            contact: portfolioData.contact,
          }),
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          console.error("[auto-save] failed", res.status, errBody);
          throw new Error("Save failed");
        }
        setIsSaved(true);
        toast.success("Portfolio saved!");
      } catch (err) {
        console.error("[auto-save] error", err);
        toast.error("Auto-save failed");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioData]);

  // ── Unpublish ─────────────────────────────────────────────────────────────
  async function handleUnpublish() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: false }),
      });
      if (!res.ok) throw new Error("Unpublish failed");
      setPortfolioStatus((prev) =>
        prev ? { ...prev, isPublished: false } : null
      );
      toast.success("Portfolio unpublished");
    } catch {
      toast.error("Failed to unpublish. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Step validation ───────────────────────────────────────────────────────
  function validateCurrentStep(): boolean {
    if (currentStep === 1) {
      const { personal, contact } = portfolioData;
      if (personal.name.trim().length < 2) {
        toast.error("Name must be at least 2 characters");
        return false;
      }
      if (!personal.title.trim()) {
        toast.error("Professional title is required");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!contact.email.trim() || !emailRegex.test(contact.email)) {
        toast.error("A valid email address is required");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (portfolioData.skills.length === 0) {
        toast.error("Add at least one skill to continue");
        return false;
      }
      return true;
    }
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setStep((currentStep + 1) as 2 | 3 | 4);
  }

  async function handleFinish() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personal: portfolioData.personal,
          skills: portfolioData.skills,
          projects: portfolioData.projects,
          experience: portfolioData.experience,
          education: portfolioData.education,
          social: portfolioData.social,
          contact: portfolioData.contact,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/preview");
    } catch {
      toast.error("Failed to save. Please try again.");
      setIsLoading(false);
    }
  }

  const StepComponent = STEP_COMPONENTS[currentStep];
  const progressValue = (currentStep / 4) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* ── Status bar ───────────────────────────────────────────────────── */}
      {portfolioStatus && dataReady && (
        <div className="mb-4 rounded-lg border bg-muted/50 px-4 py-2.5 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-muted-foreground">
                Template:{" "}
                <span className="font-medium text-foreground capitalize">
                  {portfolioStatus.templateName}
                </span>
              </span>
              {portfolioStatus.isPublished ? (
                <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                  Published
                </Badge>
              ) : (
                <Badge variant="secondary">Draft</Badge>
              )}
              {portfolioStatus.isPublished && userId && (
                <a
                  href={`/portfolio/${userId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View live <ExternalLink className="size-3" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/preview"
                className={cn(buttonVariants({ variant: "ghost", size: "xs" }))}
              >
                Change Template
              </Link>
              {portfolioStatus.isPublished && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={handleUnpublish}
                  disabled={isLoading}
                >
                  Unpublish
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Step header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">
          Step {currentStep} of 4:{" "}
          <span className="text-muted-foreground">{STEP_LABELS[currentStep]}</span>
        </p>
        <div className="flex items-center gap-1.5 text-sm">
          {isLoading ? (
            <span className="text-muted-foreground">Saving…</span>
          ) : isSaved ? (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Check className="size-3.5" />
              Saved
            </span>
          ) : null}
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────────────────────────── */}
      <div className="mb-8">
        <Progress value={progressValue}>
          <ProgressLabel className="sr-only">Step {currentStep} of 4</ProgressLabel>
        </Progress>
      </div>

      {/* ── Step content ─────────────────────────────────────────────────── */}
      <div className="min-h-96">
        {dataReady ? (
          <StepComponent />
        ) : (
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          disabled={currentStep === 1}
          onClick={() => setStep((currentStep - 1) as 1 | 2 | 3)}
        >
          Back
        </Button>

        {currentStep < 4 ? (
          <Button onClick={handleNext} disabled={!dataReady}>
            Next
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={isLoading || !dataReady}>
            {isLoading ? "Saving…" : "Preview Templates"}
          </Button>
        )}
      </div>
    </div>
  );
}
