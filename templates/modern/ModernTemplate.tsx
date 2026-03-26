import { Fragment, type CSSProperties } from "react";
import { Inter } from "next/font/google";
import {
  Github, Linkedin, Twitter, Mail, Globe, ExternalLink,
  MapPin, GraduationCap, Briefcase, Code2, Palette,
} from "lucide-react";
import type { PortfolioData, ThemeConfig } from "@/types/portfolio";
import ContactForm from "@/templates/shared/ContactForm";

const inter = Inter({ subsets: ["latin"] });

const DEFAULT_SECTION_ORDER = [
  "home", "about", "education", "skills", "projects", "experience", "contact",
];

// ── Types ────────────────────────────────────────────────────────────────────

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
  Frontend: { badge: "bg-blue-500/10 text-blue-300 border border-blue-500/20", heading: "text-blue-400" },
  Backend: { badge: "bg-green-500/10 text-green-300 border border-green-500/20", heading: "text-green-400" },
  Tools: { badge: "bg-purple-500/10 text-purple-300 border border-purple-500/20", heading: "text-purple-400" },
  Design: { badge: "bg-pink-500/10 text-pink-300 border border-pink-500/20", heading: "text-pink-400" },
  Other: { badge: "bg-zinc-700/60 text-zinc-300 border border-zinc-600/40", heading: "text-zinc-400" },
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Frontend: Code2,
  Backend: Briefcase,
  Tools: Briefcase,
  Design: Palette,
};

function getCategoryStyle(cat?: string) {
  return CATEGORY_STYLES[(cat as SkillCategory) ?? "Other"] ?? CATEGORY_STYLES.Other;
}

// ── Shared: Section heading ───────────────────────────────────────────────────

function SectionHeading({ children, primary }: { children: React.ReactNode; primary: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap">{children}</h2>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${primary}80, transparent)` }} />
    </div>
  );
}

// ── Section: Home ─────────────────────────────────────────────────────────────

function Home({ data, primary, secondary }: { data: PortfolioData; primary: string; secondary: string }) {
  const { personal, social, contact } = data;
  const links = [
    social.github && { href: social.github, label: "GitHub", Icon: Github },
    social.linkedin && { href: social.linkedin, label: "LinkedIn", Icon: Linkedin },
    social.twitter && { href: social.twitter, label: "Twitter", Icon: Twitter },
    social.website && { href: social.website, label: "Website", Icon: Globe },
    contact.email && { href: `mailto:${contact.email}`, label: contact.email, Icon: Mail },
  ].filter(Boolean) as { href: string; label: string; Icon: React.ComponentType<{ className?: string }> }[];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-zinc-950 to-zinc-900 px-6 py-24 md:py-36">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full blur-3xl"
        style={{ backgroundColor: `${primary}1a` }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full blur-3xl"
        style={{ backgroundColor: `${secondary}14` }} />
      <div className="relative mx-auto max-w-5xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl">
          {personal.name || "Your Name"}
        </h1>
        <p className="mt-3 text-xl font-medium md:text-2xl" style={{ color: primary }}>
          {personal.title || "Professional Title"}
        </p>
        {personal.tagline && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">{personal.tagline}</p>
        )}
        {links.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {links.map(({ href, label, Icon }) => (
              <a key={label} href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white">
                <Icon className="size-4" />{label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Section: About ────────────────────────────────────────────────────────────

function About({ data, primary }: { data: PortfolioData; primary: string }) {
  const { personal, skills, avatar_url } = data;
  if (!personal.bio) return null;

  // Top 3 categories for highlight cards
  const grouped = skills.reduce<Record<string, number>>((acc, s) => {
    const cat = s.category ?? "Other";
    acc[cat] = (acc[cat] ?? 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <section className="bg-zinc-900 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary}>About Me</SectionHeading>

        {/* Two-column: text | photo */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto]">
          {/* Left: bio */}
          <p className="text-base leading-relaxed text-zinc-300 md:text-lg">{personal.bio}</p>

          {/* Right: photo */}
          <div className="flex justify-center md:justify-end">
            {avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar_url}
                alt={personal.name}
                className="h-48 w-48 rounded-full object-cover md:h-64 md:w-64"
                style={{ boxShadow: `0 0 0 4px ${primary}40` }}
              />
            ) : (
              <div
                className="flex h-48 w-48 items-center justify-center rounded-full text-4xl font-black text-white md:h-64 md:w-64"
                style={{
                  background: `linear-gradient(135deg, ${primary}40, ${primary}20)`,
                  boxShadow: `0 0 0 4px ${primary}40`,
                }}
              >
                {getInitials(personal.name)}
              </div>
            )}
          </div>
        </div>

        {/* Highlight cards */}
        {topCategories.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {topCategories.map(([cat, count]) => {
              const Icon = CATEGORY_ICONS[cat] ?? Code2;
              const style = getCategoryStyle(cat);
              return (
                <div key={cat}
                  className="flex items-center gap-4 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-5 py-4">
                  <div className="flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${primary}20` }}>
                    <Icon className="size-5" style={{ color: primary }} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${style.heading}`}>{cat}</p>
                    <p className="text-xs text-zinc-500">{count} {count === 1 ? "skill" : "skills"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Section: Education ────────────────────────────────────────────────────────

function Education({ data, primary }: { data: PortfolioData; primary: string }) {
  const { education } = data;
  if (education.length === 0) return null;

  return (
    <section className="bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary}>Education</SectionHeading>
        <div className="relative flex flex-col gap-8 pl-6">
          <div className="absolute left-0 top-2 h-full w-px"
            style={{ backgroundColor: `${primary}4d` }} />
          {education.map((edu, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[1.4375rem] top-1.5 flex size-7 items-center justify-center rounded-full border-2 bg-zinc-950"
                style={{ borderColor: primary }}>
                <GraduationCap className="size-3.5" style={{ color: primary }} />
              </div>
              <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{edu.degree}</p>
                    <p className="mt-0.5 text-sm text-zinc-400">{edu.institution}</p>
                  </div>
                  <span className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: `${primary}20`, color: primary }}>
                    {edu.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section: Skills ───────────────────────────────────────────────────────────

function Skills({ data, primary }: { data: PortfolioData; primary: string }) {
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
    <section className="bg-zinc-900 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary}>Skills &amp; Technologies</SectionHeading>
        <div className="flex flex-col gap-8">
          {orderedKeys.map((category) => {
            const style = getCategoryStyle(category);
            return (
              <div key={category}>
                <p className={`mb-3 text-sm font-semibold uppercase tracking-widest ${style.heading}`}>{category}</p>
                <div className="flex flex-wrap gap-2">
                  {grouped[category].map((skill) => (
                    <span key={skill.name}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${style.badge}`}>
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

// ── Section: Projects ─────────────────────────────────────────────────────────

function Projects({ data, primary, secondary }: { data: PortfolioData; primary: string; secondary: string }) {
  const { projects } = data;
  if (projects.length === 0) return null;

  return (
    <section className="bg-zinc-950 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary}>Projects</SectionHeading>
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, i) => (
            <div key={i}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-800/50 transition-all hover:border-zinc-600">
              <div className="h-px w-full"
                style={{ background: `linear-gradient(to right, ${primary}, ${secondary})` }} />
              <div className="flex flex-1 flex-col gap-4 p-6">
                <h3 className="text-lg font-bold text-white">{project.title}</h3>
                {project.description && (
                  <p className="flex-1 text-sm leading-relaxed text-zinc-400">{project.description}</p>
                )}
                {project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span key={tech}
                        className="rounded-md bg-zinc-700/60 px-2 py-0.5 text-xs font-medium text-zinc-300">
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
    <section className="bg-zinc-900 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary}>Experience</SectionHeading>
        <div className="relative flex flex-col gap-10 pl-6">
          <div className="absolute left-0 top-2 h-full w-px"
            style={{ backgroundColor: `${primary}4d` }} />
          {experience.map((exp, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[1.4375rem] top-1.5 size-3 rounded-full border-2 bg-zinc-900"
                style={{ borderColor: primary }} />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-base font-bold text-white">{exp.role}</h3>
                <span className="text-sm font-semibold" style={{ color: primary }}>{exp.company}</span>
              </div>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{exp.period}</p>
              {exp.description && (
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{exp.description}</p>
              )}
            </div>
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
    <section className="bg-zinc-950 px-6 py-20 border-t border-zinc-800">
      <div className="mx-auto max-w-5xl">
        <SectionHeading primary={primary}>Get in Touch</SectionHeading>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: info */}
          <div>
            <p className="text-base leading-relaxed text-zinc-300">
              Have a question or want to work together? Drop me a message!
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-zinc-400">
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
                  className="text-zinc-500 transition-colors hover:text-white">
                  <Github className="size-5" />
                </a>
              )}
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="text-zinc-500 transition-colors hover:text-white">
                  <Linkedin className="size-5" />
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                  className="text-zinc-500 transition-colors hover:text-white">
                  <Twitter className="size-5" />
                </a>
              )}
              {social.website && (
                <a href={social.website} target="_blank" rel="noopener noreferrer" aria-label="Website"
                  className="text-zinc-500 transition-colors hover:text-white">
                  <Globe className="size-5" />
                </a>
              )}
            </div>
            <p className="mt-10 text-xs text-zinc-600">
              © {new Date().getFullYear()} {personal.name} · Built with{" "}
              <span className="text-zinc-500 font-medium">Portfolio Builder</span>
            </p>
          </div>

          {/* Right: form */}
          <ContactForm
            portfolioUserId={portfolioUserId}
            variant="modern"
            primary={primary}
            secondary={secondary}
          />
        </div>
      </div>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function ModernTemplate({ data, theme, sectionOrder, portfolioUserId }: Props) {
  const primary = theme?.primary ?? "#3b82f6";
  const secondary = theme?.mode === "combination" ? (theme.secondary ?? primary) : primary;
  const effectiveOrder = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_SECTION_ORDER;

  const sections: Record<string, React.ReactNode> = {
    home:       <Home data={data} primary={primary} secondary={secondary} />,
    about:      <About data={data} primary={primary} />,
    education:  <Education data={data} primary={primary} />,
    skills:     <Skills data={data} primary={primary} />,
    projects:   <Projects data={data} primary={primary} secondary={secondary} />,
    experience: <Experience data={data} primary={primary} />,
    contact:    <Contact data={data} primary={primary} secondary={secondary} portfolioUserId={portfolioUserId} />,
  };

  return (
    <div className={`${inter.className} min-h-screen bg-zinc-950 text-white`}
      style={{ "--color-primary": primary, "--color-secondary": secondary } as CSSProperties}>
      {effectiveOrder.map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </div>
  );
}
