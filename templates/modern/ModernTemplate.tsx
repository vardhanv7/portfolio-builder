import { Inter } from "next/font/google";
import { Github, Linkedin, Twitter, Mail, Globe, ExternalLink, MapPin } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

const inter = Inter({ subsets: ["latin"] });

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
  data: PortfolioData;
}

type SkillCategory = "Frontend" | "Backend" | "Tools" | "Design" | "Other";

// ── Category styling ─────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<SkillCategory, { badge: string; heading: string }> = {
  Frontend: {
    badge: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
    heading: "text-blue-400",
  },
  Backend: {
    badge: "bg-green-500/10 text-green-300 border border-green-500/20",
    heading: "text-green-400",
  },
  Tools: {
    badge: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
    heading: "text-purple-400",
  },
  Design: {
    badge: "bg-pink-500/10 text-pink-300 border border-pink-500/20",
    heading: "text-pink-400",
  },
  Other: {
    badge: "bg-zinc-700/60 text-zinc-300 border border-zinc-600/40",
    heading: "text-zinc-400",
  },
};

function getCategoryStyle(category?: string) {
  return CATEGORY_STYLES[(category as SkillCategory) ?? "Other"] ?? CATEGORY_STYLES.Other;
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ data }: Props) {
  const { personal, social, contact } = data;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 to-zinc-900 px-6 py-24 md:py-36">
      {/* Decorative gradient orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-purple-600/8 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Name */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl">
          {personal.name || "Your Name"}
        </h1>

        {/* Title */}
        <p className="mt-3 text-xl font-medium text-blue-400 md:text-2xl">
          {personal.title || "Professional Title"}
        </p>

        {/* Bio */}
        {personal.bio && (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 md:text-lg">
            {personal.bio}
          </p>
        )}

        {/* Social links */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {social.github && (
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <Github className="size-4" />
              GitHub
            </a>
          )}
          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </a>
          )}
          {social.twitter && (
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <Twitter className="size-4" />
              Twitter
            </a>
          )}
          {social.website && (
            <a
              href={social.website}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Website"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <Globe className="size-4" />
              Website
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              aria-label="Email"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <Mail className="size-4" />
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────

function Skills({ skills }: { skills: PortfolioData["skills"] }) {
  if (skills.length === 0) return null;

  // Group by category
  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  // Consistent category order
  const categoryOrder: SkillCategory[] = ["Frontend", "Backend", "Tools", "Design", "Other"];
  const orderedKeys = [
    ...categoryOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((k) => !categoryOrder.includes(k as SkillCategory)),
  ];

  return (
    <section className="bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>Skills &amp; Technologies</SectionHeading>

        <div className="flex flex-col gap-8">
          {orderedKeys.map((category) => {
            const style = getCategoryStyle(category);
            return (
              <div key={category}>
                <p className={`mb-3 text-sm font-semibold uppercase tracking-widest ${style.heading}`}>
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {grouped[category].map((skill) => (
                    <span
                      key={skill.name}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${style.badge}`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function Projects({ projects }: { projects: PortfolioData["projects"] }) {
  if (projects.length === 0) return null;

  return (
    <section className="bg-zinc-900 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>Projects</SectionHeading>

        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group relative flex flex-col overflow-hidden rounded-xl bg-zinc-800/50 border border-zinc-700/50 transition-all hover:border-zinc-600"
            >
              {/* Gradient top border */}
              <div className="h-px w-full bg-gradient-to-r from-blue-500 to-purple-500" />

              <div className="flex flex-1 flex-col gap-4 p-6">
                <h3 className="text-lg font-bold text-white">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-sm leading-relaxed text-zinc-400 flex-1">
                    {project.description}
                  </p>
                )}

                {/* Tech stack */}
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-zinc-700/60 px-2 py-0.5 text-xs font-medium text-zinc-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(project.url) && (
                  <div className="flex gap-3 pt-1">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                      >
                        <ExternalLink className="size-3.5" />
                        Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Experience ────────────────────────────────────────────────────────────────

function Experience({ experience }: { experience: PortfolioData["experience"] }) {
  if (experience.length === 0) return null;

  return (
    <section className="bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>Experience</SectionHeading>

        <div className="relative flex flex-col gap-10 pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-blue-500/30">
          {experience.map((exp, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[1.4375rem] top-1.5 size-3 rounded-full border-2 border-blue-500 bg-zinc-950" />

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-base font-bold text-white">{exp.role}</h3>
                  <span className="text-sm font-semibold text-blue-400">{exp.company}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  {exp.period}
                </p>
                {exp.description && (
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────

function Education({ education }: { education: PortfolioData["education"] }) {
  if (education.length === 0) return null;

  return (
    <section className="bg-zinc-900 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>Education</SectionHeading>

        <div className="flex flex-col gap-4">
          {education.map((edu, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-zinc-700/50 bg-zinc-800/40 px-5 py-4"
            >
              <div>
                <p className="font-semibold text-white">{edu.degree}</p>
                <p className="text-sm text-zinc-400">{edu.institution}</p>
              </div>
              <span className="shrink-0 text-sm font-medium text-zinc-500">
                {edu.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer({ data }: Props) {
  const { contact, social } = data;

  return (
    <footer className="bg-zinc-950 px-6 py-12 border-t border-zinc-800">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Contact info */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-400">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Mail className="size-4" />
                {contact.email}
              </a>
            )}
            {contact.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {contact.location}
              </span>
            )}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-zinc-500 transition-colors hover:text-white"
              >
                <Github className="size-5" />
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-zinc-500 transition-colors hover:text-white"
              >
                <Linkedin className="size-5" />
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-zinc-500 transition-colors hover:text-white"
              >
                <Twitter className="size-5" />
              </a>
            )}
            {social.website && (
              <a
                href={social.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="text-zinc-500 transition-colors hover:text-white"
              >
                <Globe className="size-5" />
              </a>
            )}
          </div>

          {/* Credit */}
          <p className="text-xs text-zinc-600">
            Built with{" "}
            <span className="text-zinc-500 font-medium">Portfolio Builder</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export default function ModernTemplate({ data }: Props) {
  return (
    <div className={`${inter.className} min-h-screen bg-zinc-950 text-white`}>
      <Hero data={data} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Experience experience={data.experience} />
      <Education education={data.education} />
      <Footer data={data} />
    </div>
  );
}
