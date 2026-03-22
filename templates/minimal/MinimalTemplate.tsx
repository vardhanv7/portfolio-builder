import { Inter } from "next/font/google";
import { Github, Linkedin, Twitter, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  data: PortfolioData;
}

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
      {children}
    </p>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero({ data }: Props) {
  const { personal, social, contact } = data;

  const socialLinks = [
    { href: social.github, label: "GitHub" },
    { href: social.linkedin, label: "LinkedIn" },
    { href: social.twitter, label: "Twitter" },
    { href: social.website, label: "Website" },
  ].filter((l) => l.href);

  return (
    <section className="bg-white px-6 py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        {/* Name */}
        <h1 className="font-serif text-5xl italic text-gray-900 md:text-7xl">
          {personal.name || "Your Name"}
        </h1>

        {/* Title */}
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.25em] text-gray-500">
          {personal.title || "Professional Title"}
        </p>

        {/* Bio */}
        {personal.bio && (
          <p className="mt-8 max-w-xl text-base leading-relaxed text-gray-600">
            {personal.bio}
          </p>
        )}

        {/* Social links */}
        {(socialLinks.length > 0 || contact.email) && (
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-gray-900"
              >
                <Mail className="size-3.5" />
                {contact.email}
              </a>
            )}
            {socialLinks.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors hover:text-gray-900"
              >
                {label}
                <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        )}

        <hr className="mt-12 border-gray-200" />
      </div>
    </section>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────

function Skills({ skills }: { skills: PortfolioData["skills"] }) {
  if (skills.length === 0) return null;

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel>Skills</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill.name}
              className="rounded border border-gray-200 px-3 py-1 text-sm text-gray-700"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────

function Projects({ projects }: { projects: PortfolioData["projects"] }) {
  if (projects.length === 0) return null;

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel>Projects</SectionLabel>
        <div className="flex flex-col divide-y divide-gray-200">
          {projects.map((project, i) => (
            <div key={i} className="py-8 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {project.title}
                </h3>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm text-gray-400 transition-colors hover:text-gray-900"
                  >
                    → Live Demo
                  </a>
                )}
              </div>

              {project.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {project.description}
                </p>
              )}

              {project.techStack.length > 0 && (
                <p className="mt-3 text-xs text-gray-400">
                  {project.techStack.join(", ")}
                </p>
              )}
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
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel>Experience</SectionLabel>
        <div className="flex flex-col gap-8">
          {experience.map((exp, i) => (
            <div key={i} className="flex gap-6">
              {/* Period column */}
              <p className="w-28 shrink-0 pt-0.5 text-xs text-gray-400 leading-relaxed">
                {exp.period}
              </p>
              {/* Content column */}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{exp.role}</p>
                <p className="text-sm text-gray-500">{exp.company}</p>
                {exp.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
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
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel>Education</SectionLabel>
        <div className="flex flex-col gap-6">
          {education.map((edu, i) => (
            <div key={i} className="flex gap-6">
              <p className="w-28 shrink-0 pt-0.5 text-xs text-gray-400">
                {edu.year}
              </p>
              <div>
                <p className="font-semibold text-gray-900">{edu.degree}</p>
                <p className="text-sm text-gray-500">{edu.institution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer({ data }: Props) {
  const { personal, contact, social } = data;
  const year = new Date().getFullYear();

  const socialIcons: { href?: string; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { href: social.github, Icon: Github, label: "GitHub" },
    { href: social.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: social.twitter, Icon: Twitter, label: "Twitter" },
    { href: social.website, Icon: Globe, label: "Website" },
  ].filter((l) => l.href);

  return (
    <footer className="bg-white px-6 py-12 border-t border-gray-100">
      <div className="mx-auto max-w-3xl flex flex-col items-center gap-4 text-center">
        {contact.location && (
          <p className="flex items-center gap-1.5 text-sm text-gray-400">
            <MapPin className="size-3.5" />
            {contact.location}
          </p>
        )}

        {socialIcons.length > 0 && (
          <div className="flex items-center gap-4">
            {socialIcons.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-400 transition-colors hover:text-gray-900"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400">
          © {year} {personal.name} · Built with{" "}
          <span className="font-medium text-gray-500">Portfolio Builder</span>
        </p>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function MinimalTemplate({ data }: Props) {
  return (
    <div className={`${inter.className} min-h-screen bg-white text-gray-900`}>
      <Hero data={data} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <Experience experience={data.experience} />
      <Education education={data.education} />
      <Footer data={data} />
    </div>
  );
}
