-- =============================================================================
-- Portfolio Builder — Supabase Schema
-- Run this in the Supabase SQL editor to set up your database.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table: portfolios
-- One row per user. All portfolio sections stored as JSONB columns so the
-- schema stays flexible as the data shape evolves.
-- ---------------------------------------------------------------------------
create table if not exists public.portfolios (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,

  -- Template selection
  template_name text not null default 'modern'
                check (template_name in ('modern', 'minimal', 'creative')),

  -- Portfolio data (JSONB — matches PortfolioData interface in types/portfolio.ts)
  personal      jsonb,
  skills        jsonb default '[]'::jsonb,
  projects      jsonb default '[]'::jsonb,
  experience    jsonb default '[]'::jsonb,
  education     jsonb default '[]'::jsonb,
  social        jsonb,
  contact       jsonb,

  -- Publishing
  is_published  boolean not null default false,

  -- Timestamps
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- One portfolio per user
  constraint portfolios_user_id_key unique (user_id)
);

-- ---------------------------------------------------------------------------
-- Index for fast lookups by user_id
-- ---------------------------------------------------------------------------
create index if not exists portfolios_user_id_idx on public.portfolios(user_id);

-- ---------------------------------------------------------------------------
-- Auto-update updated_at on every row change
-- ---------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolios_updated_at on public.portfolios;
create trigger portfolios_updated_at
  before update on public.portfolios
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.portfolios enable row level security;

-- Owners can read their own portfolio (published or not)
create policy "Users can view own portfolio"
  on public.portfolios
  for select
  using (auth.uid() = user_id);

-- Anyone can read published portfolios (for public /portfolio/[userId] pages)
create policy "Public can view published portfolios"
  on public.portfolios
  for select
  using (is_published = true);

-- Only the owner can insert
create policy "Users can insert own portfolio"
  on public.portfolios
  for insert
  with check (auth.uid() = user_id);

-- Only the owner can update
create policy "Users can update own portfolio"
  on public.portfolios
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Only the owner can delete
create policy "Users can delete own portfolio"
  on public.portfolios
  for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Optional: trigger to create an empty portfolio row on first sign-in.
-- Uncomment if you want the portfolio row to be created automatically.
-- ---------------------------------------------------------------------------
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer set search_path = public
-- as $$
-- begin
--   insert into public.portfolios (user_id)
--   values (new.id)
--   on conflict (user_id) do nothing;
--   return new;
-- end;
-- $$;
--
-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute function public.handle_new_user();
