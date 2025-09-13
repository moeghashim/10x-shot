-- Enhanced RLS Policies for Role-Based Access Control
-- Run this after database-schema.sql and user-management-schema.sql

-- Drop existing policies to replace with enhanced versions
DROP POLICY IF EXISTS "Allow authenticated users full access to projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users full access to project_metrics" ON project_metrics;
DROP POLICY IF EXISTS "Allow authenticated users full access to global_metrics" ON global_metrics;
DROP POLICY IF EXISTS "Admin users can manage admin_users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can view admin_activity" ON admin_activity;
DROP POLICY IF EXISTS "Admin users can insert admin_activity" ON admin_activity;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user exists in admin_users table and is active
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is super admin
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = auth.email() 
    AND is_active = true 
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced policies for main tables
-- Projects: Admin users can manage, public can read
CREATE POLICY "Admin users can manage projects" 
  ON projects FOR ALL 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

CREATE POLICY "Public read access to projects" 
  ON projects FOR SELECT 
  TO anon
  USING (true);

-- Project Metrics: Only admin users can manage
CREATE POLICY "Admin users can manage project_metrics" 
  ON project_metrics FOR ALL 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Global Metrics: Only admin users can manage
CREATE POLICY "Admin users can manage global_metrics" 
  ON global_metrics FOR ALL 
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Admin Users: Only super admins can manage
CREATE POLICY "Super admins can manage admin_users" 
  ON admin_users FOR ALL 
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Admin users can read their own profile
CREATE POLICY "Admin users can read own profile" 
  ON admin_users FOR SELECT 
  TO authenticated
  USING (email = auth.email() AND is_active = true);

-- Admin Activity: Admin users can view and insert
CREATE POLICY "Admin users can view admin_activity" 
  ON admin_activity FOR SELECT 
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admin users can insert admin_activity" 
  ON admin_activity FOR INSERT 
  TO authenticated
  WITH CHECK (is_admin_user());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON projects TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;