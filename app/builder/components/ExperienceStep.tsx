"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { usePortfolioStore } from "@/lib/store";

// ── Work Experience ───────────────────────────────────────────────────────────

interface ExpForm {
  company: string;
  role: string;
  period: string;
  description: string;
}

const EMPTY_EXP: ExpForm = { company: "", role: "", period: "", description: "" };

function WorkExperienceSection() {
  const { portfolioData, addExperience, removeExperience } = usePortfolioStore();
  const [form, setForm] = useState<ExpForm>(EMPTY_EXP);
  const [errors, setErrors] = useState<Partial<ExpForm>>({});
  const [showForm, setShowForm] = useState(false);

  function handleAdd() {
    const newErrors: Partial<ExpForm> = {};
    if (!form.company.trim()) newErrors.company = "Company is required";
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.period.trim()) newErrors.period = "Period is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    addExperience({ ...form });
    setForm(EMPTY_EXP);
    setErrors({});
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Work Experience</h3>
        {!showForm && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowForm(true)}
          >
            <Plus className="size-4 mr-1.5" />
            Add Experience
          </Button>
        )}
      </div>

      {/* Existing entries */}
      {portfolioData.experience.length > 0 && (
        <div className="flex flex-col divide-y rounded-lg border">
          {portfolioData.experience.map((exp, index) => (
            <div key={index} className="flex items-start justify-between gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{exp.role}</p>
                <p className="text-sm text-muted-foreground">
                  {exp.company} · {exp.period}
                </p>
                <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                  {exp.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => removeExperience(index)}
                className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="Remove experience"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {portfolioData.experience.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground italic">
          No work experience added yet.
        </p>
      )}

      {/* Add form */}
      {showForm && (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Company *</Label>
              <Input
                placeholder="Acme Corp"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              />
              {errors.company && (
                <p className="text-xs text-destructive">{errors.company}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Role *</Label>
              <Input
                placeholder="Senior Engineer"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Period *</Label>
            <Input
              placeholder="Jan 2022 – Present"
              value={form.period}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            />
            {errors.period && (
              <p className="text-xs text-destructive">{errors.period}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description *</Label>
            <Textarea
              placeholder="What did you work on? What did you accomplish?"
              className="resize-none h-20"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_EXP);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────

interface EduForm {
  institution: string;
  degree: string;
  year: string;
}

const EMPTY_EDU: EduForm = { institution: "", degree: "", year: "" };

function EducationSection() {
  const { portfolioData, addEducation, removeEducation } = usePortfolioStore();
  const [form, setForm] = useState<EduForm>(EMPTY_EDU);
  const [errors, setErrors] = useState<Partial<EduForm>>({});
  const [showForm, setShowForm] = useState(false);

  function handleAdd() {
    const newErrors: Partial<EduForm> = {};
    if (!form.institution.trim()) newErrors.institution = "Institution is required";
    if (!form.degree.trim()) newErrors.degree = "Degree is required";
    if (!form.year.trim()) newErrors.year = "Year is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    addEducation({ ...form });
    setForm(EMPTY_EDU);
    setErrors({});
    setShowForm(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Education</h3>
        {!showForm && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowForm(true)}
          >
            <Plus className="size-4 mr-1.5" />
            Add Education
          </Button>
        )}
      </div>

      {portfolioData.education.length > 0 && (
        <div className="flex flex-col divide-y rounded-lg border">
          {portfolioData.education.map((edu, index) => (
            <div key={index} className="flex items-start justify-between gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm text-muted-foreground">
                  {edu.institution} · {edu.year}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => removeEducation(index)}
                className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="Remove education"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {portfolioData.education.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground italic">
          No education added yet.
        </p>
      )}

      {showForm && (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex flex-col gap-1.5">
            <Label>Institution *</Label>
            <Input
              placeholder="MIT"
              value={form.institution}
              onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
            />
            {errors.institution && (
              <p className="text-xs text-destructive">{errors.institution}</p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Degree *</Label>
              <Input
                placeholder="B.S. Computer Science"
                value={form.degree}
                onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
              />
              {errors.degree && (
                <p className="text-xs text-destructive">{errors.degree}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Year *</Label>
              <Input
                placeholder="2020"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              />
              {errors.year && (
                <p className="text-xs text-destructive">{errors.year}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_EDU);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleAdd}>
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Social Links ──────────────────────────────────────────────────────────────

const SOCIAL_FIELDS: {
  key: keyof NonNullable<ReturnType<typeof usePortfolioStore.getState>["portfolioData"]["social"]>;
  label: string;
  placeholder: string;
}[] = [
  { key: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { key: "twitter", label: "Twitter / X", placeholder: "https://twitter.com/username" },
  { key: "website", label: "Website", placeholder: "https://yoursite.com" },
];

function SocialLinksSection() {
  const { portfolioData, updateSocial } = usePortfolioStore();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">Social Links</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              type="url"
              placeholder={placeholder}
              defaultValue={portfolioData.social[key] ?? ""}
              onBlur={(e) =>
                updateSocial({ [key]: e.target.value.trim() || undefined })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Step Component ───────────────────────────────────────────────────────

export default function ExperienceStep() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-lg font-semibold">Experience & More</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add your work history, education, and links to your profiles.
        </p>
      </div>

      <WorkExperienceSection />

      <Separator />

      <EducationSection />

      <Separator />

      <SocialLinksSection />
    </div>
  );
}
