-- Add name column to saved_colors table
ALTER TABLE public.saved_colors ADD COLUMN IF NOT EXISTS name TEXT;
