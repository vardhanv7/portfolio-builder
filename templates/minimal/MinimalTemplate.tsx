import { Fragment, type CSSProperties } from "react";
import { Inter } from "next/font/google";
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "?";
}

// ── Shared: Section label ─────────────────────────────────────────────────────

function SectionLabel({ children, primary }: { children: React.ReactNode; primary: string }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>
        {children}
      </p>
      <div className="flex-1 h-px" style={{ backgroundColor: `${primary}33` }} />
    </div>
  );
}

// ── Section: Home ─────────────────────────────────────────────────────────────

function Home({ data, primary }: { data: PortfolioData; primary: string }) {
  const { personal, social, contact } = data;

  const socialLinks = [
    { href: social.github, label: "GitHub" },
    { href: social.linkedin, label: "LinkedIn" },
    { href: social.twitter, label: "Twitter" },
    { href: social.website, label: "Website" },
  ].filter((l) => l.href) as { href: string; label: string }[];

  return (
    <section className="bg-white px-6 py-24 md:py-36">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-5xl italic text-gray-900 md:text-7xl">
          {personal.name || "Your Name"}
        </h1>
        <p className="mt-4 text-sm font-medium uppercase tracking-[0.25em]" style={{ color: primary }}>
          {personal.title || "Professional Title"}
        </p>
        {personal.tagline && (
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-500">{personal.tagline}</p>
        )}
        {(socialLinks.length > 0 || contact.email) && (
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
            {contact.email && (
              <a href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-gray-900">
                <Mail className="size-3.5" />{contact.email}
              </a>
            )}
            {socialLinks.map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors hover:text-gray-900">
                {label}<ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        )}
        <hr className="mt-12" style={{ borderColor: `${primary}33` }} />
      </div>
    </section>
  );
}

// ── Section: About ────────────────────────────────────────────────────────────

function About({ data, primary }: { data: PortfolioData; primary: string }) {
  const { personal, avatar_url } = data;
  if (!personal.bio) return null;

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel primary={primary}>About</SectionLabel>

        {/* Two-column: photo LEFT, text RIGHT */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr]">
          {/* Photo */}
          <div className="flex justify-center md:justify-start">
            {avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar_url}
                alt={personal.name}
                className="h-36 w-36 rounded-full object-cover"
                style={{ outline: `2px solid ${primary}33`, outlineOffset: "3px" }}
              />
            ) : (
              <div
                className="flex h-36 w-36 items-center justify-center rounded-full text-2xl font-bold text-gray-600"
                style={{
                  backgroundColor: `${primary}0d`,
                  outline: `2px solid ${primary}33`,
                  outlineOffset: "3px",
                }}
              >
                {getInitials(personal.name)}
              </div>
            )}
          </div>

          {/* Bio */}
          <p className="self-center text-base leading-relaxed text-gray-600">{personal.bio}</p>
        </div>
      </div>
    </section>
  );
}

// ── Section: Skills ───────────────────────────────────────────────────────────

function Skills({ data, primary }: { data: PortfolioData; primary: string }) {
  const { skills } = data;
  if (skills.length === 0) return null;

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel primary={primary}>Skills</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill.name} className="rounded px-3 py-1 text-sm"
              style={{
                border: `1px solid ${primary}33`,
                color: primary,
                backgroundColor: `${primary}0d`,
              }}>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Projects ─────────────────────────────────────────────────────────

function Projects({ data, primary }: { data: PortfolioData; primary: string }) {
  const { projects } = data;
  if (projects.length === 0) return null;

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel primary={primary}>Projects</SectionLabel>
        <div className="flex flex-col divide-y divide-gray-200">
          {projects.map((project, i) => (
            <div key={i} className="py-8 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-semibold text-gray-900">{project.title}</h3>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer"
                    className="shrink-0 text-sm transition-colors hover:opacity-70"
                    style={{ color: primary }}>
                    → Live Demo
                  </a>
                )}
              </div>
              {project.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{project.description}</p>
              )}
              {project.techStack.length > 0 && (
                <p className="mt-3 text-xs text-gray-400">{project.techStack.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Experience ───────────────────────────────────────────────────────

function Experience({ data, primary }: { data: PortfolioData; primary: string }) {
  const { experience } = data;
  if (experience.length === 0) return null;

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel primary={primary}>Experience</SectionLabel>
        <div className="flex flex-col gap-8">
          {experience.map((exp, i) => (
            <div key={i} className="flex gap-6">
              <p className="w-28 shrink-0 pt-0.5 text-xs leading-relaxed text-gray-400">{exp.period}</p>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{exp.role}</p>
                <p className="text-sm" style={{ color: primary }}>{exp.company}</p>
                {exp.description && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Education ────────────────────────────────────────────────────────

function Education({ data, primary }: { data: PortfolioData; primary: string }) {
  const { education } = data;
  if (education.length === 0) return null;

  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionLabel primary={primary}>Education</SectionLabel>
        <div className="flex flex-col gap-6">
          {education.map((edu, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `${primary}15`, color: primary }}>
                <GraduationCap className="size-4" />
              </div>
              <div className="flex-1 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">{edu.degree}</p>
                  <p className="text-sm text-gray-500">{edu.institution}</p>
                </div>
                <span className="text-xs font-medium text-gray-400">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Contact ──────────────────────────────────────────────────────────

function Contact({
  data, primary, portfolioUserId,
}: { data: PortfolioData; primary: string; portfolioUserId?: string }) {
  const { personal, contact, social } = data;

  const socialIcons: { href?: string; Icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { href: social.github, Icon: Github, label: "GitHub" },
    { href: social.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: social.twitter, Icon: Twitter, label: "Twitter" },
    { href: social.website, Icon: Globe, label: "Website" },
  ].filter((l) => l.href) as typeof socialIcons;

  return (
    <section className="bg-white px-6 py-16 border-t border-gray-100">
      <div className="mx-auto max-w-3xl">
        <SectionLabel primary={primary}>Get in Touch</SectionLabel>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: info */}
          <div>
            <p className="text-base leading-relaxed text-gray-600">
              Have a question or want to work together? Drop me a message!
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-gray-500">
              {contact.email && (
                <a href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-gray-900">
                  <Mail className="size-3.5 shrink-0" style={{ color: primary }} />
                  {contact.email}
                </a>
              )}
              {contact.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="size-3.5 shrink-0" style={{ color: primary }} />
                  {contact.location}
                </span>
              )}
            </div>
            {socialIcons.length > 0 && (
              <div className="mt-5 flex items-center gap-4">
                {socialIcons.map(({ href, Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="text-gray-400 transition-colors hover:text-gray-900">
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            )}
            <p className="mt-10 text-xs text-gray-400">
              © {new Date().getFullYear()} {personal.name} · Built with{" "}
              <span className="font-medium text-gray-500">Portfolio Builder</span>
            </p>
          </div>

          {/* Right: form */}
          <ContactForm
            portfolioUserId={portfolioUserId}
            variant="minimal"
            primary={primary}
          />
        </div>
      </div>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function MinimalTemplate({ data, theme, sectionOrder, portfolioUserId }: Props) {
  const primary = theme?.primary ?? "#3b82f6";
  const effectiveOrder = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_SECTION_ORDER;

  const sections: Record<string, React.ReactNode> = {
    home:       <Home data={data} primary={primary} />,
    about:      <About data={data} primary={primary} />,
    education:  <Education data={data} primary={primary} />,
    skills:     <Skills data={data} primary={primary} />,
    projects:   <Projects data={data} primary={primary} />,
    experience: <Experience data={data} primary={primary} />,
    contact:    <Contact data={data} primary={primary} portfolioUserId={portfolioUserId} />,
  };

  return (
    <div className={`${inter.className} min-h-screen bg-white text-gray-900`}
      style={{ "--color-primary": primary } as CSSProperties}>
      {effectiveOrder.map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </div>
  );
}
