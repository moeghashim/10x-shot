-- Remove deprecated my_skills field from projects
ALTER TABLE projects
DROP COLUMN IF EXISTS my_skills;
