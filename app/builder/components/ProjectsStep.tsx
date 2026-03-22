"use client";

import { useState } from "react";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePortfolioStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const MAX_PROJECTS = 6;

export default function ProjectsStep() {
  const { portfolioData, addProject, removeProject, updateProject } =
    usePortfolioStore();

  const [openCards, setOpenCards] = useState<Set<number>>(new Set());
  const [techInputs, setTechInputs] = useState<Record<number, string>>({});

  function handleAddProject() {
    if (portfolioData.projects.length >= MAX_PROJECTS) return;
    const newIndex = portfolioData.projects.length;
    addProject({
      title: "",
      description: "",
      techStack: [],
      url: undefined,
      image: undefined,
    });
    // Open the new card after the store update schedules a re-render
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
        // Initialize tech input from store if not already tracked
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
    const parsed = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateProject(index, { techStack: parsed });
  }

  function handleRemoveProject(index: number) {
    removeProject(index);
    // Remap open cards: shift all indices > deleted index down by 1
    setOpenCards((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
    // Remap tech inputs the same way
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

  const atMax = portfolioData.projects.length >= MAX_PROJECTS;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Showcase your work. Add up to {MAX_PROJECTS} projects.
          </p>
        </div>
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

      {/* Empty state */}
      {portfolioData.projects.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 border-2 border-dashed border-muted rounded-xl">
          <p className="text-muted-foreground text-sm">
            No projects yet. Add your first one!
          </p>
          <Button type="button" variant="outline" onClick={handleAddProject}>
            <Plus className="size-4 mr-1.5" />
            Add Project
          </Button>
        </div>
      )}

      {/* Project cards */}
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
                      onChange={(e) =>
                        updateProject(index, { title: e.target.value })
                      }
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
                      onChange={(e) =>
                        updateProject(index, { description: e.target.value })
                      }
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`tech-${index}`}>
                      Tech Stack{" "}
                      <span className="text-muted-foreground font-normal">
                        (comma-separated)
                      </span>
                    </Label>
                    <Input
                      id={`tech-${index}`}
                      placeholder="React, TypeScript, PostgreSQL"
                      value={techString}
                      onChange={(e) =>
                        handleTechInputChange(index, e.target.value)
                      }
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
                          updateProject(index, {
                            url: e.target.value || undefined,
                          })
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor={`image-${index}`}>Image URL</Label>
                      <Input
                        id={`image-${index}`}
                        type="url"
                        placeholder="https://..."
                        value={project.image ?? ""}
                        onChange={(e) =>
                          updateProject(index, {
                            image: e.target.value || undefined,
                          })
                        }
                      />
                    </div>
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
