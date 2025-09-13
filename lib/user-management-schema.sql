-- User Management Schema Extension
-- Run this after the main database-schema.sql

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user activity log
CREATE TABLE IF NOT EXISTS admin_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id INTEGER,
  details TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add update trigger for admin_users
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;

-- Create admin policies
CREATE POLICY "Admin users can manage admin_users" 
  ON admin_users FOR ALL 
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can view admin_activity" 
  ON admin_activity FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert admin_activity" 
  ON admin_activity FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_activity_user_id ON admin_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity(created_at);

-- Insert initial admin user (password: AdminUser2024!Secure)  
-- Note: This is a proper bcrypt hash for the password "AdminUser2024!Secure"
INSERT INTO admin_users (email, password_hash, full_name, role) VALUES 
('admin@10xbuilder.ai', '$2b$12$lWQ6vwXCG4LNrmqYu7JfYuRkb/Xc4gsb09FHb6uJjeavhNlpIZ0NO', '10x Admin', 'super_admin')
ON CONFLICT (email) DO NOTHING;