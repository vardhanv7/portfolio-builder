# Portfolio Builder

A full-stack web application where developers create and publish a professional portfolio in minutes. Sign in with GitHub or Google, fill out a multi-step form, preview three distinct templates with your real data, select one, and share your public URL — no coding required.

---

## Features

- **OAuth authentication** — Sign in with GitHub or Google via Supabase Auth
- **Multi-step builder** — Guided 4-step form: Personal Info → Skills → Projects → Experience & Education
- **Auto-save** — Portfolio data is debounced and saved to Supabase automatically as you type
- **3 portfolio templates** — Modern (dark), Minimal (editorial white), Creative (gradient animations)
- **Live preview** — See your portfolio rendered with real data before publishing
- **Public URLs** — Every published portfolio gets a unique shareable URL (`/portfolio/{userId}`)
- **HTML export** — Download a self-contained `portfolio.html` file to host anywhere
- **ISR** — Public portfolio pages use Incremental Static Regeneration (60s revalidate)
- **Responsive** — All templates and the builder UI work at 375px and up

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Database & Auth | Supabase (PostgreSQL + GitHub/Google OAuth) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Base UI primitives) |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Forms | React Hook Form 7 + Zod 4 |
| Global State | Zustand 5 |
| Notifications | Sonner |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- GitHub and/or Google OAuth app credentials configured in Supabase

### Clone & Install

```bash
git clone https://github.com/your-username/portfolio-builder.git
cd portfolio-builder
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> The service role key is not required — all auth uses the anon key with Row Level Security.

### Database Setup

Run the SQL in `supabase-schema.sql` against your Supabase project:

1. Open your Supabase dashboard → **SQL Editor**
2. Paste the contents of `supabase-schema.sql` and run it
3. This creates the `portfolios` table and all RLS policies

### Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment (Vercel)

See the [Deployment Instructions](#deployment-instructions) section at the bottom for step-by-step guidance.

---

## Folder Structure

```
portfolio-builder/
├── app/
│   ├── api/
│   │   ├── export/route.ts         # GET — downloads portfolio.html
│   │   └── portfolio/route.ts      # GET/POST — portfolio CRUD
│   ├── auth/callback/route.ts      # OAuth callback handler
│   ├── builder/
│   │   ├── page.tsx                # Multi-step builder shell
│   │   └── components/             # PersonalInfoStep, SkillsStep, ProjectsStep, ExperienceStep
│   ├── login/page.tsx              # OAuth sign-in page
│   ├── portfolio/[userId]/page.tsx # Public portfolio page (ISR)
│   ├── preview/page.tsx            # Template selector + live preview
│   ├── error.tsx                   # Global error boundary
│   ├── not-found.tsx               # 404 page
│   ├── layout.tsx                  # Root layout (Navbar + Toaster)
│   └── page.tsx                    # Landing page
├── components/
│   ├── shared/
│   │   ├── Navbar.tsx              # Server Component — fetches user
│   │   └── NavbarClient.tsx        # Client Component — hamburger + mobile menu
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── actions/auth.ts             # Sign-out server action
│   ├── store.ts                    # Zustand portfolio store
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       └── server.ts               # Server Supabase client
├── templates/
│   ├── index.ts                    # Template registry + exports
│   ├── modern/ModernTemplate.tsx   # Dark, bold layout
│   ├── minimal/MinimalTemplate.tsx # Light, editorial layout
│   └── creative/CreativeTemplate.tsx # Gradient + Framer Motion
├── types/
│   └── portfolio.ts                # Shared PortfolioData interface
├── supabase-schema.sql             # Database schema + RLS policies
└── middleware.ts                   # Auth guard for /builder and /preview
```

---

## Deployment Instructions

### 1. Push to GitHub

```bash
git remote add origin https://github.com/your-username/portfolio-builder.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no build settings needed
4. Click **Deploy**

### 3. Add Environment Variables on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Redeploy after adding variables.

### 4. Update Supabase Redirect URLs

In your Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs** — add both:
  ```
  https://your-app.vercel.app/auth/callback
  http://localhost:3000/auth/callback
  ```

### 5. Update OAuth App Callback URLs

**GitHub** (github.com → Settings → Developer Settings → OAuth Apps → your app):

- Authorization callback URL:
  ```
  https://your-supabase-project.supabase.co/auth/v1/callback
  ```

**Google** (Google Cloud Console → APIs & Services → Credentials → your OAuth client):

- Authorized redirect URI:
  ```
  https://your-supabase-project.supabase.co/auth/v1/callback
  ```

> OAuth callbacks always route through Supabase first, then Supabase redirects to your app's `/auth/callback`. The GitHub/Google apps point to the Supabase URL — this never changes regardless of your app's domain.

---

## License

MIT
