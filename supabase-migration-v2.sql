-- Portfolio Builder v2 Migration
-- Run this in the Supabase SQL Editor

ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS avatar_url TEXT;

ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS theme JSONB NOT NULL DEFAULT '{"mode": "single", "primary": "#3b82f6", "secondary": "#8b5cf6", "preset": "ocean"}';

ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS section_order JSONB NOT NULL DEFAULT '["home", "about", "education", "skills", "projects", "experience", "contact"]';
