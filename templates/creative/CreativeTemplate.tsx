"use client";

import { Fragment, type CSSProperties } from "react";
import { Inter } from "next/font/google";
import { motion } from "framer-motion";
import {
  Github, Linkedin, Twitter, Mail, Globe,
  MapPin, ExternalLink, GraduationCap,
} from "lucide-react";
import type { PortfolioData, ThemeConfig } from "@/types/portfolio";
import ContactForm from "@/templates/shared/ContactForm";

const inter = Inter({ subsets: ["latin"] });

const DEFAULT_SECTION_ORDER = [
  "home", "about", "education", "skills", "projects", "experience", "contact",
];

interface Props {
  data: PortfolioData;
  theme?: ThemeConfig;
  sectionOrder?: string[];
  portfolioUserId?: string;
}

type SkillCategory = "Frontend" | "Backend" | "Tools" | "Design" | "Other";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";
}

const CATEGORY_STYLES: Record<SkillCategory, { badge: string; heading: string }> = {
  Frontend: { badge: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30", heading: "text-cyan-400" },
  Backend: { badge: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/30", heading: "text-emerald-400" },
  Tools: { badge: "bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-amber-300 border border-amber-500/30", heading: "text-amber-400" },
  Design: { badge: "bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-rose-300 border border-rose-500/30", heading: "text-rose-400" },
  Other: { badge: "bg-white/5 text-gray-400 border border-white/10", heading: "text-gray-400" },
};

function getCategoryStyle(cat?: string) {
  return CATEGORY_STYLES[(cat as SkillCategory) ?? "Other"] ?? CATEGORY_STYLES.Other;
}

// ── Animation ────────────────────────────────────────────────────────────────

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show"
      viewport={{ once: true }} transition={{ duration: 0.5, delay }} className={className}>
      {children}
    </motion.div>
  );
}

// ── Shared: Section heading ───────────────────────────────────────────────────

function SectionHeading({ children, primary, secondary }: { children: React.ReactNode; primary: string; secondary: string }) {
  return (
    <FadeUp className="mb-10">
      <h2 className="text-2xl font-bold text-white md:text-3xl">{children}</h2>
      <div className="mt-3 h-px w-16"
        style={{ background: `linear-gradient(to right, ${primary}, ${secondary})` }} />
    </FadeUp>
  );
}

// ── Section: Home ─────────────────────────────────────────────────────────────

function Home({ data, primary, secondary }: { data: PortfolioData; primary: string; secondary: string }) {
  const { personal, social, contact } = data;

  const links = [
    social.github && { href: social.github, Icon: Github, label: "GitHub" },
    social.linkedin && { href: social.linkedin, Icon: Linkedin, label: "LinkedIn" },
    social.twitter && { href: social.twitter, Icon: Twitter, label: "Twitter" },
    social.website && { href: social.website, Icon: Globe, label: "Website" },
    contact.email && { href: `mailto:${contact.email}`, Icon: Mail, label: contact.email },
  ].filter(Boolean) as { href: string; Icon: React.ComponentType<{ className?: string }>; label: string }[];

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-24"
      style={{ background: "linear-gradient(135deg, #0f0f23 0%, #1a0533 50%, #0f0f23 100%)" }}>
      <motion.div aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{ backgroundColor: `${primary}33` }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ backgroundColor: `${secondary}26` }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

      <div className="relative mx-auto max-w-5xl w-full">
        <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl font-black leading-none tracking-tight md:text-8xl bg-clip-text text-transparent"
          style={{ backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})` }}>
          {personal.name || "Your Name"}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-xl font-medium" style={{ color: secondary }}>
          {personal.title || "Professional Title"}
        </motion.p>

        {personal.tagline && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
            {personal.tagline}
          </motion.p>
        )}

        {links.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-3">
            {links.map(({ href, Icon, label }) => (
              <a key={label} href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-300 backdrop-blur-sm transition-all hover:text-white"
                style={{
                  border: `1px solid ${primary}4d`,
                  background: `linear-gradient(to right, ${primary}1a, ${secondary}1a)`,
                }}>
                <Icon className="size-4" />{label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ── Section: About ────────────────────────────────────────────────────────────

function About({ data, primary, secondary }: { data: PortfolioData; primary: string; secondary: string }) {
  const { personal, avatar_url } = data;
  if (!personal.bio) return null;

  return (
    <section className="bg-gray-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary} secondary={secondary}>About Me</SectionHeading>

        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
          {/* Floating photo */}
          <FadeUp className="shrink-0">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Gradient ring */}
              <div className="absolute -inset-1 rounded-full"
                style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
              {avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar_url}
                  alt={personal.name}
                  className="relative h-48 w-48 rounded-full object-cover"
                />
              ) : (
                <div
                  className="relative flex h-48 w-48 items-center justify-center rounded-full text-4xl font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${primary}40, ${secondary}30)` }}
                >
                  {getInitials(personal.name)}
                </div>
              )}
            </motion.div>
          </FadeUp>

          {/* Bio */}
          <FadeUp delay={0.1} className="flex-1">
            <p className="text-base leading-relaxed text-gray-300 md:text-lg">{personal.bio}</p>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── Section: Skills ───────────────────────────────────────────────────────────

function Skills({ data, primary, secondary }: { data: PortfolioData; primary: string; secondary: string }) {
  const { skills } = data;
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
        <SectionHeading primary={primary} secondary={secondary}>Skills &amp; Technologies</SectionHeading>
        <div className="flex flex-col gap-8">
          {orderedKeys.map((category, ci) => {
            const style = getCategoryStyle(category);
            return (
              <FadeUp key={category} delay={ci * 0.07}>
                <p className={`mb-3 text-xs font-bold uppercase tracking-widest ${style.heading}`}>{category}</p>
                <div className="flex flex-wrap gap-2">
                  {grouped[category].map((skill, si) => (
                    <motion.span key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }} transition={{ duration: 0.3, delay: si * 0.04 }}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${style.badge}`}>
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

// ── Section: Projects ─────────────────────────────────────────────────────────

function Projects({ data, primary, secondary }: { data: PortfolioData; primary: string; secondary: string }) {
  const { projects } = data;
  if (projects.length === 0) return null;

  return (
    <section className="bg-gray-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary} secondary={secondary}>Projects</SectionHeading>
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="rounded-xl p-px"
                style={{ background: `linear-gradient(135deg, ${primary}99, ${secondary}66)` }}>
                <div className="flex h-full flex-col gap-4 rounded-xl bg-gray-900 p-6">
                  <h3 className="text-base font-bold text-white">{project.title}</h3>
                  {project.description && (
                    <p className="flex-1 text-sm leading-relaxed text-gray-400">{project.description}</p>
                  )}
                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span key={tech}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-400 border border-white/10">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                      style={{ color: primary }}>
                      <ExternalLink className="size-3.5" />Live Demo
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

// ── Section: Experience ───────────────────────────────────────────────────────

function Experience({ data, primary, secondary }: { data: PortfolioData; primary: string; secondary: string }) {
  const { experience } = data;
  if (experience.length === 0) return null;

  return (
    <section className="bg-gray-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary} secondary={secondary}>Experience</SectionHeading>
        <div className="relative pl-6">
          <div className="absolute left-0 top-2 h-full w-px opacity-40"
            style={{ background: `linear-gradient(to bottom, ${primary}, ${secondary})` }} />
          <div className="flex flex-col gap-10">
            {experience.map((exp, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="relative">
                  <div className="absolute -left-[1.4375rem] top-1.5 size-3 rounded-full"
                    style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-bold text-white">{exp.role}</h3>
                    <span className="text-sm font-semibold" style={{ color: primary }}>{exp.company}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gray-500">{exp.period}</p>
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

// ── Section: Education ────────────────────────────────────────────────────────

function Education({ data, primary, secondary }: { data: PortfolioData; primary: string; secondary: string }) {
  const { education } = data;
  if (education.length === 0) return null;

  return (
    <section className="bg-gray-950 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary} secondary={secondary}>Education</SectionHeading>
        <div className="flex flex-col gap-4">
          {education.map((edu, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <div className="rounded-xl p-px"
                style={{ background: `linear-gradient(to right, ${primary}66, ${secondary}33)` }}>
                <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-900 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `linear-gradient(135deg, ${primary}40, ${secondary}30)` }}>
                      <GraduationCap className="size-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{edu.degree}</p>
                      <p className="text-sm text-gray-400">{edu.institution}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ background: `linear-gradient(to right, ${primary}60, ${secondary}40)` }}>
                    {edu.year}
                  </span>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Contact ──────────────────────────────────────────────────────────

function Contact({
  data, primary, secondary, portfolioUserId,
}: { data: PortfolioData; primary: string; secondary: string; portfolioUserId?: string }) {
  const { personal, contact, social } = data;

  return (
    <section className="bg-gray-950 px-6 py-20 border-t border-white/10">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary} secondary={secondary}>Get in Touch</SectionHeading>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: info */}
          <FadeUp>
            <p className="text-base leading-relaxed text-gray-300">
              Have a question or want to work together? Drop me a message!
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-gray-400">
              {contact.email && (
                <a href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-white">
                  <Mail className="size-4 shrink-0" style={{ color: primary }} />
                  {contact.email}
                </a>
              )}
              {contact.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0" style={{ color: primary }} />
                  {contact.location}
                </span>
              )}
            </div>
            <div className="mt-6 flex gap-4">
              {social.github && (
                <a href={social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                  className="text-gray-600 transition-colors hover:text-white">
                  <Github className="size-5" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="text-gray-600 transition-colors hover:text-white">
                  <Linkedin className="size-5" />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                  className="text-gray-600 transition-colors hover:text-white">
                  <Twitter className="size-5" />
                </a>
              )}
              {social.website && (
                <a href={social.website} target="_blank" rel="noopener noreferrer" aria-label="Website"
                  className="text-gray-600 transition-colors hover:text-white">
                  <Globe className="size-5" />
                </a>
              )}
            </div>
            <p className="mt-10 bg-clip-text text-sm font-black text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})` }}>
              {personal.name}
            </p>
            <p className="mt-1 text-xs text-gray-700">
              Built with <span className="text-gray-600 font-medium">Portfolio Builder</span>
            </p>
          </FadeUp>

          {/* Right: glassmorphism form */}
          <FadeUp delay={0.1}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <ContactForm
                portfolioUserId={portfolioUserId}
                variant="creative"
                primary={primary}
                secondary={secondary}
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function CreativeTemplate({ data, theme, sectionOrder, portfolioUserId }: Props) {
  const primary = theme?.primary ?? "#8b5cf6";
  const secondary = theme?.mode === "combination" ? (theme.secondary ?? primary) : primary;
  const effectiveOrder = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_SECTION_ORDER;

  const sections: Record<string, React.ReactNode> = {
    home:       <Home data={data} primary={primary} secondary={secondary} />,
    about:      <About data={data} primary={primary} secondary={secondary} />,
    education:  <Education data={data} primary={primary} secondary={secondary} />,
    skills:     <Skills data={data} primary={primary} secondary={secondary} />,
    projects:   <Projects data={data} primary={primary} secondary={secondary} />,
    experience: <Experience data={data} primary={primary} secondary={secondary} />,
    contact:    <Contact data={data} primary={primary} secondary={secondary} portfolioUserId={portfolioUserId} />,
  };

  return (
    <div className={`${inter.className} min-h-screen bg-gray-950 text-white`}
      style={{ "--color-primary": primary, "--color-secondary": secondary } as CSSProperties}>
      {effectiveOrder.map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </div>
  );
}
