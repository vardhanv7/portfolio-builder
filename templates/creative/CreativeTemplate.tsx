"use client";

import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  data: PortfolioData;
}

type SkillCategory = "Frontend" | "Backend" | "Tools" | "Design" | "Other";

// ── Animation variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Skill category styles ─────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<SkillCategory, { badge: string; heading: string }> = {
  Frontend: {
    badge: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    heading: "text-cyan-400",
  },
  Backend: {
    badge: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    heading: "text-emerald-400",
  },
  Tools: {
    badge: "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-amber-300 border border-amber-500/30",
    heading: "text-amber-400",
  },
  Design: {
    badge: "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-rose-300 border border-rose-500/30",
    heading: "text-rose-400",
  },
  Other: {
    badge: "bg-white/5 text-gray-400 border border-white/10",
    heading: "text-gray-400",
  },
};

function getCategoryStyle(category?: string) {
  return CATEGORY_STYLES[(category as SkillCategory) ?? "Other"] ?? CATEGORY_STYLES.Other;
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <FadeUp className="mb-10">
      <h2 className="text-2xl font-bold text-white md:text-3xl">{children}</h2>
      <div className="mt-3 h-px w-16 bg-gradient-to-r from-violet-500 to-pink-500" />
    </FadeUp>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ data }: Props) {
  const { personal, social, contact } = data;

  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-24"
      style={{ background: "linear-gradient(135deg, #0f0f23 0%, #1a0533 50%, #0f0f23 100%)" }}
    >
      {/* Animated blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      <div className="relative mx-auto max-w-5xl w-full">
        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl font-black leading-none tracking-tight md:text-8xl bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent"
        >
          {personal.name || "Your Name"}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-xl font-medium text-cyan-400"
        >
          {personal.title || "Professional Title"}
        </motion.p>

        {/* Bio */}
        {personal.bio && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300"
          >
            {personal.bio}
          </motion.p>
        )}

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {social.github && (
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-pink-500/10 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm transition-all hover:border-violet-400/50 hover:text-white"
            >
              <Github className="size-4" /> GitHub
            </a>
          )}
          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-pink-500/10 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm transition-all hover:border-violet-400/50 hover:text-white"
            >
              <Linkedin className="size-4" /> LinkedIn
            </a>
          )}
          {social.twitter && (
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-pink-500/10 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm transition-all hover:border-violet-400/50 hover:text-white"
            >
              <Twitter className="size-4" /> Twitter
            </a>
          )}
          {social.website && (
            <a
              href={social.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-pink-500/10 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm transition-all hover:border-violet-400/50 hover:text-white"
            >
              <Globe className="size-4" /> Website
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-pink-500/10 px-4 py-2 text-sm text-gray-300 backdrop-blur-sm transition-all hover:border-violet-400/50 hover:text-white"
            >
              <Mail className="size-4" /> {contact.email}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────

function Skills({ skills }: { skills: PortfolioData["skills"] }) {
  if (skills.length === 0) return null;

  const grouped = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category ?? "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categoryOrder: SkillCategory[] = ["Frontend", "Backend", "Tools", "Design", "Other"];
  const orderedKeys = [
    ...categoryOrder.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((k) => !categoryOrder.includes(k as SkillCategory)),
  ];

  return (
    <section className="bg-gray-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>Skills &amp; Technologies</SectionHeading>
        <div className="flex flex-col gap-8">
          {orderedKeys.map((category, ci) => {
            const style = getCategoryStyle(category);
            return (
              <FadeUp key={category} delay={ci * 0.07}>
                <p className={`mb-3 text-xs font-bold uppercase tracking-widest ${style.heading}`}>
                  {category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {grouped[category].map((skill, si) => (
                    <motion.span
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: si * 0.04 }}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${style.badge}`}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </FadeUp>
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
    <section className="bg-gray-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>Projects</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              {/* Gradient border wrapper */}
              <div className="rounded-xl bg-gradient-to-br from-violet-500/60 via-fuchsia-500/40 to-pink-500/60 p-px">
                <div className="flex h-full flex-col gap-4 rounded-xl bg-gray-900 p-6">
                  <h3 className="text-base font-bold text-white">{project.title}</h3>
                  {project.description && (
                    <p className="flex-1 text-sm leading-relaxed text-gray-400">
                      {project.description}
                    </p>
                  )}
                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-400 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
                    >
                      <ExternalLink className="size-3.5" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </FadeUp>
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
    <section className="bg-gray-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>Experience</SectionHeading>
        <div className="relative pl-6">
          {/* Gradient timeline line */}
          <div className="absolute left-0 top-2 h-full w-px bg-gradient-to-b from-violet-500 via-fuchsia-500 to-pink-500 opacity-40" />

          <div className="flex flex-col gap-10">
            {experience.map((exp, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="relative">
                  {/* Gradient dot */}
                  <div className="absolute -left-[1.4375rem] top-1.5 size-3 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-bold text-white">{exp.role}</h3>
                    <span className="text-sm font-semibold text-violet-400">{exp.company}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                    {exp.period}
                  </p>
                  {exp.description && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-400">{exp.description}</p>
                  )}
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Education ─────────────────────────────────────────────────────────────────

function Education({ education }: { education: PortfolioData["education"] }) {
  if (education.length === 0) return null;

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>Education</SectionHeading>
        <div className="flex flex-col gap-4">
          {education.map((edu, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div className="rounded-lg border-l-2 border-violet-500 bg-white/5 px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{edu.degree}</p>
                  <p className="text-sm text-gray-400">{edu.institution}</p>
                </div>
                <span className="shrink-0 text-sm text-gray-500">{edu.year}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer({ data }: Props) {
  const { personal, contact, social } = data;

  return (
    <footer className="bg-gray-950 border-t border-white/10 px-6 py-12">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-5 text-center">
        <p className="text-lg font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
          {personal.name}
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
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

        <div className="flex items-center gap-4">
          {social.github && (
            <a href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="text-gray-600 transition-colors hover:text-violet-400">
              <Github className="size-5" />
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="text-gray-600 transition-colors hover:text-violet-400">
              <Linkedin className="size-5" />
            </a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
              className="text-gray-600 transition-colors hover:text-violet-400">
              <Twitter className="size-5" />
            </a>
          )}
          {social.website && (
            <a href={social.website} target="_blank" rel="noopener noreferrer" aria-label="Website"
              className="text-gray-600 transition-colors hover:text-violet-400">
              <Globe className="size-5" />
            </a>
          )}
        </div>

        <p className="text-xs text-gray-700">
          Built with <span className="text-gray-600 font-medium">Portfolio Builder</span>
        </p>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function CreativeTemplate({ data }: Props) {
  return (
    <div className={`${inter.className} min-h-screen bg-gray-950 text-white`}>
      <Hero data={data} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Experience experience={data.experience} />
      <Education education={data.education} />
      <Footer data={data} />
    </div>
  );
}
