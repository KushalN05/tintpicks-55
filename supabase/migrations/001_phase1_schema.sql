-- ============================================================
-- TintPicks — Phase 1 Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 1. Extend profiles table ────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- ── 2. Enable RLS on both tables ────────────────────────────
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_colors   ENABLE ROW LEVEL SECURITY;

-- ── 3. RLS policies for profiles ────────────────────────────

-- Users can only read their own profile
CREATE POLICY IF NOT EXISTS "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (created on sign-up)
CREATE POLICY IF NOT EXISTS "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update only their own profile
CREATE POLICY IF NOT EXISTS "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── 4. RLS policies for saved_colors ────────────────────────

-- Users can only read their own colors
CREATE POLICY IF NOT EXISTS "saved_colors_select_own"
  ON public.saved_colors
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert colors tied to their own user_id
CREATE POLICY IF NOT EXISTS "saved_colors_insert_own"
  ON public.saved_colors
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own colors
CREATE POLICY IF NOT EXISTS "saved_colors_delete_own"
  ON public.saved_colors
  FOR DELETE
  USING (auth.uid() = user_id);

-- ── 5. Create profiles automatically on sign-up ─────────────
-- This trigger fires on every new auth.users row so a profile
-- always exists before the app tries to read it.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
