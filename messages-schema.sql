-- ── Messages table for in-app portfolio inbox ─────────────────────────────
-- Run this in the Supabase SQL Editor.

CREATE TABLE messages (
  id                 UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_owner_id UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_name        TEXT        NOT NULL,
  sender_email       TEXT        NOT NULL,
  message            TEXT        NOT NULL,
  is_read            BOOLEAN     DEFAULT false,
  created_at         TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Portfolio owners can view their own messages
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (auth.uid() = portfolio_owner_id);

-- Portfolio owners can mark messages as read
CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE USING (auth.uid() = portfolio_owner_id);

-- Anyone (unauthenticated visitors) can send a message via contact form
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);
