# Portfolio Builder — CLAUDE.md

## Project Overview

A web app where users log in, enter their skills/info via a multi-step form, preview 2–3 portfolio templates with their real data, select one, and get a public portfolio URL. Also supports HTML export for self-hosting.

Users authenticate via GitHub or Google OAuth (Supabase Auth). The admin dashboard is a multi-step builder form. The public-facing portfolio uses ISR for performance.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (GitHub + Google OAuth) |
| DB client | `@supabase/supabase-js` + `@supabase/ssr` |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animations | Framer Motion (Creative template only) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| State | Zustand (synced with Supabase for persistence) |
| Image uploads | Supabase Storage |
| Deployment | Vercel |

---

## Architecture

### Routing Structure (App Router)

```
app/
  (public)/
    [username]/page.tsx        # ISR — renders user's portfolio via Template Registry
    layout.tsx
  (auth)/
    login/page.tsx             # OAuth sign-in page
    callback/route.ts          # Supabase OAuth callback handler
  (admin)/
    dashboard/page.tsx         # Multi-step portfolio builder
    layout.tsx                 # Auth guard — redirects if not logged in
  api/
    portfolio/route.ts         # GET/PUT portfolio data
    projects/route.ts          # CRUD for projects
    experience/route.ts        # CRUD for work experience
    skills/route.ts            # CRUD for skills
    export/route.ts            # HTML export generation
  layout.tsx                   # Root layout (next/font setup here)
  page.tsx                     # Landing/home page
```

### Template System

**Component Map Pattern**: Each template is a standalone React component accepting a shared `PortfolioData` interface as props. A **Template Registry** (single object) maps template names to components for dynamic rendering.

```
templates/
  modern/ModernTemplate.tsx    # Dark, bold
  minimal/MinimalTemplate.tsx  # Light, editorial
  creative/CreativeTemplate.tsx # Vibrant gradients + Framer Motion animations
  registry.ts                  # { modern: ModernTemplate, minimal: ..., creative: ... }
  types.ts                     # PortfolioData interface (shared by all templates)
```

Rules:
- All templates receive identical `PortfolioData` props — only presentation differs.
- Never put data-fetching logic inside template components.
- Template-specific styles stay inside their own directory — never bleed into shared components.
- CSS variables in `globals.css` drive per-template theme tokens (colors, fonts).

### File Structure

```
app/               # Next.js App Router pages and layouts
components/
  ui/              # shadcn/ui components (do not build custom primitives)
  shared/          # Reusable project components (auth guards, nav, etc.)
templates/         # Portfolio template components + registry
lib/
  supabase/
    server.ts      # createServerClient — Server Components + API routes only
    client.ts      # createBrowserClient — Client Components only
  store.ts         # Zustand store (synced with Supabase)
  helpers.ts       # Misc utilities
types/
  index.ts         # All shared TypeScript interfaces (single source of truth)
```

---

## Database Schema (Supabase / PostgreSQL)

### `profiles`
Created automatically on first login via a DB trigger on `auth.users`.

| Column | Type | Notes |
|---|---|---|
| id | uuid | FK → auth.users.id |
| username | text | Unique, URL-safe slug — used in public URL |
| full_name | text | |
| avatar_url | text | |
| template | text | `'modern' \| 'minimal' \| 'creative'` |
| is_published | boolean | Controls public visibility |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `about`
One-to-one with `profiles`.

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| headline | text | Short tagline |
| bio | text | Long-form bio |
| location | text | |
| website_url | text | |
| github_url | text | |
| linkedin_url | text | |
| twitter_url | text | |

### `projects`

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| title | text | |
| description | text | |
| image_url | text | Supabase Storage URL |
| live_url | text | |
| repo_url | text | |
| tags | text[] | Array of tag strings |
| featured | boolean | Pinned to top of showcase |
| sort_order | integer | Manual ordering |
| created_at | timestamptz | |

### `experience`

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| company | text | |
| role | text | |
| start_date | date | |
| end_date | date | Nullable — null means "present" |
| description | text | |
| sort_order | integer | |

### `skills`

| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles.id |
| name | text | |
| category | text | e.g. "Frontend", "DevOps" |
| proficiency | integer | 1–5 scale |
| sort_order | integer | |

### Row Level Security (RLS)

All tables use RLS. General policy pattern:
- **SELECT**: Public rows where `is_published = true`; always allowed for the owner.
- **INSERT / UPDATE / DELETE**: Only the authenticated owner (`auth.uid() = user_id`).

Always verify RLS policies work by testing in an incognito window (unauthenticated session).

---

## Admin Dashboard — Multi-Step Builder

A multi-step form wizard managed with Zustand. Each step auto-saves to the DB on "Next". The final step previews the live portfolio before publishing.

| Step | Content |
|---|---|
| 1 | Profile & Username |
| 2 | About / Bio |
| 3 | Work Experience |
| 4 | Skills |
| 5 | Projects |
| 6 | Template preview + selection + Publish |

The Zustand store syncs with Supabase — local state is the source of truth during the session; Supabase is the persistent store.

---

## Key Conventions

### TypeScript
- Strict mode (`"strict": true` in tsconfig).
- All shared interfaces live in `types/index.ts`. Do not duplicate type definitions.
- API route handlers typed with `NextRequest` / `NextResponse`.
- Define Zod schemas first; infer TypeScript types from them (`z.infer<typeof schema>`).

### Components
- Use **shadcn/ui** components — do not build custom UI primitives.
- Prefer **Server Components** by default; add `"use client"` only when needed (event handlers, hooks, browser APIs).
- Use `next/font` for all Google Fonts — no CDN font links.
- Icons: Lucide React only.

### Data Fetching
- Server Components fetch directly from Supabase using `lib/supabase/server.ts`.
- Client Components use API routes or the Zustand store — never import the server client in a client component.
- Public portfolio pages (`[username]`) use **ISR** (`revalidate` export) for performance.

### Forms
- All forms use React Hook Form + Zod.
- Never use uncontrolled inputs outside React Hook Form.

### Styling
- Tailwind CSS v4 utility classes. Avoid custom CSS unless template theming requires it.
- CSS variables in `globals.css` for per-template theme tokens.

### Error Handling
- API routes return consistent JSON: `{ data, error }`.
- Never expose raw Supabase error messages to the client in production.

### File Naming
- Components: `PascalCase.tsx`
- Utilities / hooks / store: `camelCase.ts`
- Route handlers: `route.ts` (Next.js convention)

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Server-only — never expose to client
```

Store in `.env.local`. Never commit this file.

---

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

---

## Testing

- Manual testing via browser.
- Always verify Supabase RLS policies in an incognito window (unauthenticated session).

---

## Out of Scope

- No blog / articles feature.
- No contact form or email sending.
- No SSO beyond GitHub and Google OAuth.
