"use client";

import { useState, useRef } from "react";
import { ChevronDown, Trash2, Plus, Github, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const MAX_PROJECTS = 6;

interface GitHubRepo {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
}

export default function ProjectsStep() {
  const { portfolioData, addProject, removeProject, updateProject } =
    usePortfolioStore();

  const [openCards, setOpenCards] = useState<Set<number>>(new Set());
  const [techInputs, setTechInputs] = useState<Record<number, string>>({});

  // GitHub import state
  const [showImport, setShowImport] = useState(false);
  const [ghUsername, setGhUsername] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedRepos, setFetchedRepos] = useState<GitHubRepo[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // ── Existing project card handlers ──────────────────────────────────────────

  function handleAddProject() {
    if (portfolioData.projects.length >= MAX_PROJECTS) return;
    const newIndex = portfolioData.projects.length;
    addProject({ title: "", description: "", techStack: [], url: undefined, image: undefined });
    setTimeout(() => {
      setOpenCards((prev) => new Set([...prev, newIndex]));
      setTechInputs((prev) => ({ ...prev, [newIndex]: "" }));
    }, 0);
  }

  function toggleCard(index: number) {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        setTechInputs((ti) => ({
          ...ti,
          [index]:
            ti[index] !== undefined
              ? ti[index]
              : portfolioData.projects[index].techStack.join(", "),
        }));
      }
      return next;
    });
  }

  function handleTechInputChange(index: number, value: string) {
    setTechInputs((prev) => ({ ...prev, [index]: value }));
    const parsed = value.split(",").map((s) => s.trim()).filter(Boolean);
    updateProject(index, { techStack: parsed });
  }

  function handleRemoveProject(index: number) {
    removeProject(index);
    setOpenCards((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
    setTechInputs((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const i = parseInt(key);
        if (i < index) next[i] = val;
        else if (i > index) next[i - 1] = val;
      });
      return next;
    });
  }

  // ── GitHub import handlers ───────────────────────────────────────────────────

  function toggleImportPanel() {
    setShowImport((v) => !v);
    if (!showImport) {
      // Focus username input when panel opens
      setTimeout(() => usernameInputRef.current?.focus(), 50);
    }
  }

  async function handleFetchRepos() {
    const username = ghUsername.trim();
    if (!username) return;

    setIsFetching(true);
    setFetchedRepos([]);
    setSelected(new Set());

    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(username)}`);
      const json: { data: GitHubRepo[] | null; error: string | null } = await res.json();

      if (!res.ok || json.error) {
        toast.error(json.error ?? "Failed to fetch repositories.");
        return;
      }

      const repos = json.data ?? [];
      if (repos.length === 0) {
        toast.error(`No public repositories found for "${username}".`);
        return;
      }

      setFetchedRepos(repos);
      // Pre-select all non-duplicate repos up to the available slots
      const existingTitles = new Set(
        portfolioData.projects.map((p) => p.title.toLowerCase().trim())
      );
      const slotsLeft = MAX_PROJECTS - portfolioData.projects.length;
      const autoSelected = new Set<number>();
      repos.forEach((repo, i) => {
        if (
          autoSelected.size < slotsLeft &&
          !existingTitles.has(repo.title.toLowerCase().trim())
        ) {
          autoSelected.add(i);
        }
      });
      setSelected(autoSelected);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsFetching(false);
    }
  }

  function toggleRepoSelect(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handleImportSelected() {
    const existingTitles = new Set(
      portfolioData.projects.map((p) => p.title.toLowerCase().trim())
    );
    const slotsLeft = MAX_PROJECTS - portfolioData.projects.length;

    const toImport = [...selected]
      .sort((a, b) => a - b)
      .map((i) => fetchedRepos[i])
      .filter((repo) => !existingTitles.has(repo.title.toLowerCase().trim()));

    if (toImport.length === 0) {
      toast.error("All selected projects are already in your list.");
      return;
    }

    const capped = toImport.slice(0, slotsLeft);
    const skipped = toImport.length - capped.length;

    capped.forEach((repo) => {
      addProject({
        title: repo.title,
        description: repo.description,
        techStack: repo.techStack,
        url: repo.liveUrl,
        githubUrl: repo.githubUrl,
        image: undefined,
      });
    });

    if (skipped > 0) {
      toast.error(
        `Imported ${capped.length} project${capped.length !== 1 ? "s" : ""}. ${skipped} skipped — project limit reached.`
      );
    } else {
      toast.success(`Imported ${capped.length} project${capped.length !== 1 ? "s" : ""}.`);
    }

    setShowImport(false);
    setFetchedRepos([]);
    setSelected(new Set());
    setGhUsername("");
  }

  // ── Derived values ───────────────────────────────────────────────────────────

  const atMax = portfolioData.projects.length >= MAX_PROJECTS;
  const slotsLeft = MAX_PROJECTS - portfolioData.projects.length;

  const existingTitlesSet = new Set(
    portfolioData.projects.map((p) => p.title.toLowerCase().trim())
  );
  const selectedNonDuplicateCount = [...selected].filter(
    (i) => !existingTitlesSet.has(fetchedRepos[i]?.title.toLowerCase().trim())
  ).length;
  const importableCount = Math.min(selectedNonDuplicateCount, slotsLeft);

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Showcase your work. Add up to {MAX_PROJECTS} projects.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            variant={showImport ? "secondary" : "outline"}
            onClick={toggleImportPanel}
            disabled={atMax && !showImport}
          >
            <Github className="size-4 mr-1.5" />
            Import from GitHub
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddProject}
            disabled={atMax}
          >
            <Plus className="size-4 mr-1.5" />
            Add Project
          </Button>
        </div>
      </div>

      {/* ── GitHub import panel ─────────────────────────────────────────────── */}
      {showImport && (
        <Card className="border-dashed">
          <CardContent className="pt-4 pb-5 flex flex-col gap-4">
            {/* Username fetch row */}
            <div className="flex gap-2">
              <Input
                ref={usernameInputRef}
                placeholder="GitHub username"
                value={ghUsername}
                onChange={(e) => setGhUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFetchRepos();
                }}
                className="flex-1"
                disabled={isFetching}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleFetchRepos}
                disabled={!ghUsername.trim() || isFetching}
              >
                {isFetching ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Fetch Repos"
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowImport(false);
                  setFetchedRepos([]);
                  setSelected(new Set());
                }}
                aria-label="Close import panel"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Slots warning */}
            {atMax && (
              <p className="text-sm text-destructive">
                You&apos;ve reached the maximum of {MAX_PROJECTS} projects. Remove one to import more.
              </p>
            )}

            {/* Fetched repo list */}
            {fetchedRepos.length > 0 && (
              <>
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {fetchedRepos.map((repo, i) => {
                    const isDuplicate = existingTitlesSet.has(repo.title.toLowerCase().trim());
                    const isChecked = selected.has(i);

                    return (
                      <label
                        key={i}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
                          isDuplicate
                            ? "opacity-50 cursor-not-allowed bg-muted"
                            : isChecked
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isDuplicate || atMax}
                          onChange={() => !isDuplicate && toggleRepoSelect(i)}
                          className="mt-0.5 accent-primary shrink-0"
                        />
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm truncate">{repo.title}</span>
                            {repo.techStack[0] && (
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {repo.techStack[0]}
                              </Badge>
                            )}
                            {isDuplicate && (
                              <Badge variant="outline" className="text-xs shrink-0 text-muted-foreground">
                                already added
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {repo.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Import footer */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    {importableCount > 0
                      ? `${importableCount} project${importableCount !== 1 ? "s" : ""} will be imported · ${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} remaining`
                      : selected.size > 0 && selectedNonDuplicateCount === 0
                      ? "All selected are already in your list"
                      : `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} remaining`}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleImportSelected}
                    disabled={selected.size === 0 || importableCount === 0 || atMax}
                  >
                    Import Selected
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {portfolioData.projects.length === 0 && !showImport && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 border-2 border-dashed border-muted rounded-xl">
          <p className="text-muted-foreground text-sm">
            No projects yet. Add one manually or import from GitHub.
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={toggleImportPanel}>
              <Github className="size-4 mr-1.5" />
              Import from GitHub
            </Button>
            <Button type="button" variant="outline" onClick={handleAddProject}>
              <Plus className="size-4 mr-1.5" />
              Add Project
            </Button>
          </div>
        </div>
      )}

      {/* ── Project cards ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {portfolioData.projects.map((project, index) => {
          const isOpen = openCards.has(index);
          const techString = techInputs[index] ?? project.techStack.join(", ");

          return (
            <Card key={index} className="overflow-hidden">
              {/* Card header / toggle */}
              <button
                type="button"
                onClick={() => toggleCard(index)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium truncate">
                  {project.title || `Project ${index + 1}`}
                </span>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveProject(index);
                    }}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    aria-label="Delete project"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {/* Card body */}
              {isOpen && (
                <CardContent className="border-t pt-4 pb-5 flex flex-col gap-4">
                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`title-${index}`}>Project Title</Label>
                    <Input
                      id={`title-${index}`}
                      placeholder="My Awesome Project"
                      value={project.title}
                      onChange={(e) => updateProject(index, { title: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`desc-${index}`}>Description</Label>
                    <Textarea
                      id={`desc-${index}`}
                      placeholder="What does this project do? What problem does it solve?"
                      className="resize-none h-24"
                      value={project.description}
                      onChange={(e) => updateProject(index, { description: e.target.value })}
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`tech-${index}`}>
                      Tech Stack{" "}
                      <span className="text-muted-foreground font-normal">(comma-separated)</span>
                    </Label>
                    <Input
                      id={`tech-${index}`}
                      placeholder="React, TypeScript, PostgreSQL"
                      value={techString}
                      onChange={(e) => handleTechInputChange(index, e.target.value)}
                    />
                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {project.techStack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* URLs */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`url-${index}`}>Live URL</Label>
                      <Input
                        id={`url-${index}`}
                        type="url"
                        placeholder="https://myproject.com"
                        value={project.url ?? ""}
                        onChange={(e) =>
                          updateProject(index, { url: e.target.value || undefined })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`github-${index}`}>GitHub URL</Label>
                      <Input
                        id={`github-${index}`}
                        type="url"
                        placeholder="https://github.com/user/repo"
                        value={project.githubUrl ?? ""}
                        onChange={(e) =>
                          updateProject(index, { githubUrl: e.target.value || undefined })
                        }
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`image-${index}`}>Image URL</Label>
                    <Input
                      id={`image-${index}`}
                      type="url"
                      placeholder="https://..."
                      value={project.image ?? ""}
                      onChange={(e) =>
                        updateProject(index, { image: e.target.value || undefined })
                      }
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {atMax && (
        <p className="text-sm text-muted-foreground text-center">
          Maximum of {MAX_PROJECTS} projects reached.
        </p>
      )}
    </div>
  );
}
