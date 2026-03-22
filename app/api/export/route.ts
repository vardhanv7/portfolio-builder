import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioData } from "@/types/portfolio";

// ── HTML generators ────────────────────────────────────────────────────────

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function socialLinks(social: PortfolioData["social"]): string {
  const links = [
    { href: social.github, label: "GitHub" },
    { href: social.linkedin, label: "LinkedIn" },
    { href: social.twitter, label: "Twitter" },
    { href: social.website, label: "Website" },
  ].filter((l) => l.href);

  return links
    .map(
      (l) =>
        `<a href="${esc(l.href!)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`
    )
    .join("\n    ");
}

// ── Modern (dark) ──────────────────────────────────────────────────────────

function buildModern(data: PortfolioData): string {
  const { personal, skills, projects, experience, education, social, contact } =
    data;

  const skillsHtml =
    skills.length > 0
      ? `<section class="px-6 py-16 bg-zinc-900">
  <div class="mx-auto max-w-4xl">
    <h2 class="mb-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">Skills</h2>
    <div class="flex flex-wrap gap-2">
      ${skills
        .map(
          (s) =>
            `<span class="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">${esc(s.name)}</span>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const projectsHtml =
    projects.length > 0
      ? `<section class="px-6 py-16 bg-zinc-950">
  <div class="mx-auto max-w-4xl">
    <h2 class="mb-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">Projects</h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      ${projects
        .map(
          (p) => `<div class="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 class="font-semibold text-white">${esc(p.title)}</h3>
        ${p.description ? `<p class="mt-2 text-sm text-zinc-400">${esc(p.description)}</p>` : ""}
        ${p.techStack.length > 0 ? `<p class="mt-3 text-xs text-zinc-600">${p.techStack.map(esc).join(", ")}</p>` : ""}
        ${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-sm text-blue-400">→ Live Demo</a>` : ""}
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const expHtml =
    experience.length > 0
      ? `<section class="px-6 py-16 bg-zinc-900">
  <div class="mx-auto max-w-4xl">
    <h2 class="mb-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">Experience</h2>
    <div class="flex flex-col gap-8">
      ${experience
        .map(
          (e) => `<div>
        <p class="font-semibold text-white">${esc(e.role)}</p>
        <p class="text-sm text-zinc-400">${esc(e.company)} · ${esc(e.period)}</p>
        ${e.description ? `<p class="mt-2 text-sm text-zinc-500">${esc(e.description)}</p>` : ""}
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const eduHtml =
    education.length > 0
      ? `<section class="px-6 py-16 bg-zinc-950">
  <div class="mx-auto max-w-4xl">
    <h2 class="mb-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">Education</h2>
    <div class="flex flex-col gap-6">
      ${education
        .map(
          (e) => `<div>
        <p class="font-semibold text-white">${esc(e.degree)}</p>
        <p class="text-sm text-zinc-400">${esc(e.institution)} · ${esc(e.year)}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  return `<div class="min-h-screen bg-zinc-950 text-white font-sans">
  <section class="px-6 py-24 bg-zinc-950">
    <div class="mx-auto max-w-4xl">
      <h1 class="text-5xl font-bold text-white">${esc(personal.name || "Your Name")}</h1>
      <p class="mt-3 text-lg text-blue-400">${esc(personal.title || "")}</p>
      ${personal.bio ? `<p class="mt-6 max-w-xl text-zinc-400">${esc(personal.bio)}</p>` : ""}
      <div class="mt-6 flex flex-wrap gap-4 text-sm text-zinc-500">
        ${contact.email ? `<a href="mailto:${esc(contact.email)}" class="hover:text-white">${esc(contact.email)}</a>` : ""}
        ${socialLinks(social)}
      </div>
    </div>
  </section>
  ${skillsHtml}
  ${projectsHtml}
  ${expHtml}
  ${eduHtml}
  <footer class="px-6 py-10 bg-zinc-950 border-t border-zinc-800 text-center text-sm text-zinc-600">
    © ${new Date().getFullYear()} ${esc(personal.name || "")}
  </footer>
</div>`;
}

// ── Minimal (light) ────────────────────────────────────────────────────────

function buildMinimal(data: PortfolioData): string {
  const { personal, skills, projects, experience, education, social, contact } =
    data;

  const skillsHtml =
    skills.length > 0
      ? `<section class="px-6 py-16 bg-white">
  <div class="mx-auto max-w-3xl">
    <p class="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-400">Skills</p>
    <div class="flex flex-wrap gap-2">
      ${skills
        .map(
          (s) =>
            `<span class="rounded border border-gray-200 px-3 py-1 text-sm text-gray-700">${esc(s.name)}</span>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const projectsHtml =
    projects.length > 0
      ? `<section class="px-6 py-16 bg-gray-50">
  <div class="mx-auto max-w-3xl">
    <p class="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-400">Projects</p>
    <div class="flex flex-col divide-y divide-gray-200">
      ${projects
        .map(
          (p) => `<div class="py-8">
        <div class="flex items-baseline justify-between gap-4">
          <h3 class="font-semibold text-gray-900">${esc(p.title)}</h3>
          ${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-400">→ Live Demo</a>` : ""}
        </div>
        ${p.description ? `<p class="mt-2 text-sm text-gray-600">${esc(p.description)}</p>` : ""}
        ${p.techStack.length > 0 ? `<p class="mt-3 text-xs text-gray-400">${p.techStack.map(esc).join(", ")}</p>` : ""}
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const expHtml =
    experience.length > 0
      ? `<section class="px-6 py-16 bg-white">
  <div class="mx-auto max-w-3xl">
    <p class="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-400">Experience</p>
    <div class="flex flex-col gap-8">
      ${experience
        .map(
          (e) => `<div class="flex gap-6">
        <p class="w-28 shrink-0 text-xs text-gray-400 pt-0.5">${esc(e.period)}</p>
        <div>
          <p class="font-semibold text-gray-900">${esc(e.role)}</p>
          <p class="text-sm text-gray-500">${esc(e.company)}</p>
          ${e.description ? `<p class="mt-2 text-sm text-gray-600">${esc(e.description)}</p>` : ""}
        </div>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const eduHtml =
    education.length > 0
      ? `<section class="px-6 py-16 bg-gray-50">
  <div class="mx-auto max-w-3xl">
    <p class="mb-8 text-xs font-semibold uppercase tracking-widest text-gray-400">Education</p>
    <div class="flex flex-col gap-6">
      ${education
        .map(
          (e) => `<div class="flex gap-6">
        <p class="w-28 shrink-0 text-xs text-gray-400 pt-0.5">${esc(e.year)}</p>
        <div>
          <p class="font-semibold text-gray-900">${esc(e.degree)}</p>
          <p class="text-sm text-gray-500">${esc(e.institution)}</p>
        </div>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  return `<div class="min-h-screen bg-white text-gray-900 font-sans">
  <section class="px-6 py-24 bg-white">
    <div class="mx-auto max-w-3xl">
      <h1 class="text-5xl italic font-serif text-gray-900">${esc(personal.name || "Your Name")}</h1>
      <p class="mt-4 text-sm font-medium uppercase tracking-widest text-gray-500">${esc(personal.title || "")}</p>
      ${personal.bio ? `<p class="mt-8 max-w-xl text-base text-gray-600">${esc(personal.bio)}</p>` : ""}
      <div class="mt-8 flex flex-wrap gap-5 text-sm text-gray-500">
        ${contact.email ? `<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>` : ""}
        ${socialLinks(social)}
      </div>
      <hr class="mt-12 border-gray-200" />
    </div>
  </section>
  ${skillsHtml}
  ${projectsHtml}
  ${expHtml}
  ${eduHtml}
  <footer class="px-6 py-12 bg-white border-t border-gray-100 text-center text-xs text-gray-400">
    © ${new Date().getFullYear()} ${esc(personal.name || "")}
  </footer>
</div>`;
}

// ── Creative (dark + gradient) ─────────────────────────────────────────────

function buildCreative(data: PortfolioData): string {
  const { personal, skills, projects, experience, education, social, contact } =
    data;

  const skillsHtml =
    skills.length > 0
      ? `<section class="px-6 py-20" style="background:#030712">
  <div class="mx-auto max-w-4xl">
    <h2 class="mb-8 text-xs font-semibold uppercase tracking-widest text-violet-400">Skills</h2>
    <div class="flex flex-wrap gap-2">
      ${skills
        .map(
          (s) =>
            `<span class="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-300">${esc(s.name)}</span>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const projectsHtml =
    projects.length > 0
      ? `<section class="px-6 py-20" style="background:#030712">
  <div class="mx-auto max-w-4xl">
    <h2 class="mb-8 text-xs font-semibold uppercase tracking-widest text-violet-400">Projects</h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      ${projects
        .map(
          (p) => `<div style="background:linear-gradient(135deg,#7c3aed22,#ec489922);border:1px solid #7c3aed44" class="rounded-xl p-6">
        <h3 class="font-semibold text-white">${esc(p.title)}</h3>
        ${p.description ? `<p class="mt-2 text-sm text-gray-400">${esc(p.description)}</p>` : ""}
        ${p.techStack.length > 0 ? `<p class="mt-3 text-xs text-gray-600">${p.techStack.map(esc).join(", ")}</p>` : ""}
        ${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-sm text-fuchsia-400">→ Live Demo</a>` : ""}
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const expHtml =
    experience.length > 0
      ? `<section class="px-6 py-20" style="background:#030712">
  <div class="mx-auto max-w-4xl">
    <h2 class="mb-8 text-xs font-semibold uppercase tracking-widest text-violet-400">Experience</h2>
    <div class="flex flex-col gap-8">
      ${experience
        .map(
          (e) => `<div class="border-l-2 border-violet-500 pl-6">
        <p class="font-semibold text-white">${esc(e.role)}</p>
        <p class="text-sm text-gray-400">${esc(e.company)} · ${esc(e.period)}</p>
        ${e.description ? `<p class="mt-2 text-sm text-gray-500">${esc(e.description)}</p>` : ""}
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  const eduHtml =
    education.length > 0
      ? `<section class="px-6 py-20" style="background:#030712">
  <div class="mx-auto max-w-4xl">
    <h2 class="mb-8 text-xs font-semibold uppercase tracking-widest text-violet-400">Education</h2>
    <div class="flex flex-col gap-6">
      ${education
        .map(
          (e) => `<div class="border-l-2 border-fuchsia-500 pl-6">
        <p class="font-semibold text-white">${esc(e.degree)}</p>
        <p class="text-sm text-gray-400">${esc(e.institution)} · ${esc(e.year)}</p>
      </div>`
        )
        .join("\n      ")}
    </div>
  </div>
</section>`
      : "";

  return `<div class="min-h-screen font-sans text-white" style="background:#030712">
  <section class="relative px-6 py-32 overflow-hidden" style="background:linear-gradient(135deg,#0f0f23,#1a0533,#0f0f23)">
    <div class="mx-auto max-w-4xl relative z-10">
      <h1 class="text-6xl font-black" style="background:linear-gradient(to right,#a78bfa,#e879f9,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${esc(personal.name || "Your Name")}</h1>
      <p class="mt-4 text-lg font-medium text-cyan-400">${esc(personal.title || "")}</p>
      ${personal.bio ? `<p class="mt-6 max-w-xl text-gray-300">${esc(personal.bio)}</p>` : ""}
      <div class="mt-8 flex flex-wrap gap-4 text-sm text-gray-400">
        ${contact.email ? `<a href="mailto:${esc(contact.email)}" class="text-violet-400">${esc(contact.email)}</a>` : ""}
        ${socialLinks(social)}
      </div>
    </div>
  </section>
  ${skillsHtml}
  ${projectsHtml}
  ${expHtml}
  ${eduHtml}
  <footer class="px-6 py-10 text-center text-sm text-gray-600" style="border-top:1px solid #1f1f3a">
    © ${new Date().getFullYear()} ${esc(personal.name || "")}
  </footer>
</div>`;
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
  }

  const portfolioData: PortfolioData = {
    personal: (portfolio.personal as PortfolioData["personal"]) ?? {
      name: "",
      title: "",
      bio: "",
    },
    skills: (portfolio.skills as PortfolioData["skills"]) ?? [],
    projects: (portfolio.projects as PortfolioData["projects"]) ?? [],
    experience: (portfolio.experience as PortfolioData["experience"]) ?? [],
    education: (portfolio.education as PortfolioData["education"]) ?? [],
    social: (portfolio.social as PortfolioData["social"]) ?? {},
    contact: (portfolio.contact as PortfolioData["contact"]) ?? { email: "" },
  };

  const templateName = (portfolio.template_name as string) ?? "modern";
  const name = portfolioData.personal.name || "Portfolio";

  const builders: Record<string, (d: PortfolioData) => string> = {
    modern: buildModern,
    minimal: buildMinimal,
    creative: buildCreative,
  };

  const buildBody = builders[templateName] ?? buildModern;
  const body = buildBody(portfolioData);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(name)} — Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="m-0 p-0">
${body}
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'attachment; filename="portfolio.html"',
    },
  });
}
