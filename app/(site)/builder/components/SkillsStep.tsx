"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePortfolioStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Frontend", "Backend", "Tools", "Design", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Frontend: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Backend:  "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Tools:    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Design:   "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  Other:    "bg-muted text-muted-foreground border-border",
};

function getCategoryClass(category?: string): string {
  return CATEGORY_COLORS[(category as Category) ?? "Other"] ?? CATEGORY_COLORS["Other"];
}

const SUGGESTED_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Docker",
  "Git", "Next.js", "Tailwind CSS", "GraphQL", "AWS", "Figma",
  "Vue.js", "Go", "MongoDB", "Redis", "Kubernetes", "REST APIs",
];

export default function SkillsStep() {
  const { portfolioData, addSkill, removeSkill } = usePortfolioStore();
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState<string>("");

  function handleAddSkill() {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    const isDuplicate = portfolioData.skills.some(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Skill already added");
      return;
    }
    addSkill({ name: trimmed, category: skillCategory || undefined });
    setSkillName("");
  }

  function handleAddSuggested(name: string) {
    const isDuplicate = portfolioData.skills.some(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) return;
    addSkill({ name, category: skillCategory || undefined });
  }

  const addedNames = new Set(portfolioData.skills.map((s) => s.name.toLowerCase()));
  const filteredSuggestions = SUGGESTED_SKILLS.filter(
    (s) => !addedNames.has(s.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add your technical skills and tools. At least one is required.
        </p>
      </div>

      {/* Add skill input row */}
      <div className="flex flex-col gap-1.5">
        <Label>Add a Skill</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. TypeScript"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            className="flex-1"
          />
          <Select value={skillCategory} onValueChange={(v) => setSkillCategory(v ?? "")}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" onClick={handleAddSkill}>
            Add
          </Button>
        </div>
      </div>

      {/* Current skills */}
      {portfolioData.skills.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">
            Your Skills ({portfolioData.skills.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {portfolioData.skills.map((skill, index) => (
              <Badge
                key={index}
                className={cn(getCategoryClass(skill.category), "gap-1 pl-2.5 pr-1.5 h-6")}
              >
                {skill.name}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
                  aria-label={`Remove ${skill.name}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggested skills */}
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wide">
            Suggestions
          </Label>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleAddSuggested(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary hover:bg-accent transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {portfolioData.skills.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          No skills added yet. Type a skill above or click a suggestion.
        </p>
      )}
    </div>
  );
}
