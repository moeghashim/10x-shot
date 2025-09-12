-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  domain VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'completed')),
  my_skills TEXT[] DEFAULT '{}',
  ai_skills TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  productivity DECIMAL(3,1) DEFAULT 0 CHECK (productivity >= 0 AND productivity <= 10),
  timeframe VARCHAR(100),
  url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project metrics table for month-over-month tracking
CREATE TABLE IF NOT EXISTS project_metrics (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  month DATE NOT NULL, -- Store as YYYY-MM-01 format
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  productivity_score DECIMAL(3,1) DEFAULT 0 CHECK (productivity_score >= 0 AND productivity_score <= 10),
  hours_worked INTEGER DEFAULT 0 CHECK (hours_worked >= 0),
  ai_assistance_hours INTEGER DEFAULT 0 CHECK (ai_assistance_hours >= 0),
  manual_hours INTEGER DEFAULT 0 CHECK (manual_hours >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, month)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_metrics_updated_at 
  BEFORE UPDATE ON project_metrics 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample projects (based on existing project-grid data)
INSERT INTO projects (id, title, domain, description, progress, status, my_skills, ai_skills, tools, productivity, timeframe, url) VALUES
(1, 'AI E-commerce Platform', 'E-commerce', 'Automated product descriptions, pricing optimization, and customer service', 85, 'active', 
 ARRAY['React', 'Node.js', 'Database Design'], 
 ARRAY['Content Generation', 'Price Optimization', 'Customer Support'], 
 ARRAY['ChatGPT', 'Stripe', 'Vercel', 'Supabase', 'Midjourney'], 
 8.2, '3 months', 'https://ai-ecommerce-demo.vercel.app'),

(2, 'Bannaa - Arabic AI School', 'Media & Content', 'AI‑focused school targeting the Arab world.', 2, 'active',
 ARRAY['Content Strategy', 'Management'], 
 ARRAY['Writing', 'Video Editing', 'Image Generation'], 
 ARRAY['ChatGPT', 'Claude', 'Runway ML', 'N8N', 'Airtable', 'VEO', 'Gemini', 'Midjourney'], 
 0.1, '2 months', 'https://bannaa.ai'),

(3, 'Data Analytics Dashboard', 'Analytics', 'Automated data processing, visualization, and insight generation', 78, 'active',
 ARRAY['Data Analysis', 'Visualization', 'Statistics'], 
 ARRAY['Data Processing', 'Pattern Recognition', 'Report Generation'], 
 ARRAY['ChatGPT', 'Tableau', 'Python', 'Jupyter', 'AWS', 'MongoDB'], 
 6.8, '4 months', 'https://analytics-ai-dashboard.vercel.app'),

(4, 'Mobile Fitness App', 'Health & Fitness', 'Personalized workout plans, nutrition tracking, and progress monitoring', 65, 'active',
 ARRAY['Mobile Development', 'UI/UX', 'Health Domain'], 
 ARRAY['Personalization', 'Computer Vision', 'Nutrition Analysis'], 
 ARRAY['ChatGPT', 'React Native', 'Firebase', 'TensorFlow', 'Figma'], 
 5.2, '5 months', 'https://fitness-ai-app.vercel.app'),

(5, 'Legal Document Processor', 'Legal Tech', 'Contract analysis, document generation, and compliance checking', 45, 'active',
 ARRAY['Legal Research', 'Document Processing', 'Compliance'], 
 ARRAY['NLP', 'Document Analysis', 'Legal Reasoning'], 
 ARRAY['ChatGPT', 'Claude', 'LangChain', 'Pinecone', 'Notion', 'DocuSign'], 
 4.1, '6 months', 'https://legal-ai-processor.vercel.app')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to continue from the highest existing ID
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_domain ON projects(domain);
CREATE INDEX IF NOT EXISTS idx_project_metrics_project_id ON project_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_project_metrics_month ON project_metrics(month);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin access)
CREATE POLICY "Allow authenticated users full access to projects" 
  ON projects FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access to project_metrics" 
  ON project_metrics FOR ALL 
  USING (auth.role() = 'authenticated');

-- Allow public read access to projects (for the main website)
CREATE POLICY "Allow public read access to projects" 
  ON projects FOR SELECT 
  USING (true);

-- Create a view for easy project metrics analysis
CREATE OR REPLACE VIEW project_metrics_with_details AS
SELECT 
  pm.*,
  p.title as project_title,
  p.domain as project_domain,
  p.status as project_status,
  CASE 
    WHEN pm.hours_worked > 0 
    THEN ROUND((pm.ai_assistance_hours::DECIMAL / pm.hours_worked) * 100, 1)
    ELSE 0
  END as ai_efficiency_percentage
FROM project_metrics pm
JOIN projects p ON pm.project_id = p.id
ORDER BY pm.month DESC, p.title;