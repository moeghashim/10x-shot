-- Migration: Add objectives column to projects table
-- Run this in Supabase SQL Editor

-- Add the objectives column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS objectives VARCHAR(150);

-- Verify the column was added
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'objectives';
