import { NextRequest, NextResponse } from "next/server";

function toTitleCase(str: string): string {
  return str
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json(
      { data: null, error: "username query param is required" },
      { status: 400 }
    );
  }

  let res: Response;
  try {
    res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "portfolio-builder-app",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 300 },
      }
    );
  } catch {
    return NextResponse.json(
      { data: null, error: "Failed to reach GitHub. Check your connection." },
      { status: 502 }
    );
  }

  if (res.status === 404) {
    return NextResponse.json(
      { data: null, error: `GitHub user "${username}" not found.` },
      { status: 404 }
    );
  }

  if (res.status === 403 || res.status === 429) {
    return NextResponse.json(
      { data: null, error: "GitHub API rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { data: null, error: "GitHub returned an unexpected error." },
      { status: 502 }
    );
  }

  const repos: GitHubRepo[] = await res.json();

  const projects = repos
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      title: toTitleCase(repo.name),
      description: repo.description ?? "No description provided",
      techStack: ([repo.language].filter(Boolean) as string[]),
      githubUrl: repo.html_url,
      liveUrl: repo.homepage || undefined,
    }));

  return NextResponse.json({ data: projects, error: null });
}
