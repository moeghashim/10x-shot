-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  skills TEXT[] NOT NULL,
  tools TEXT[] NOT NULL,
  productivity DECIMAL NOT NULL CHECK (productivity >= 0),
  timeframe TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  twitter_followers INTEGER NOT NULL DEFAULT 0,
  linkedin_followers INTEGER NOT NULL DEFAULT 0,
  newsletter_subscribers INTEGER NOT NULL DEFAULT 0,
  total_gmv DECIMAL NOT NULL DEFAULT 0,
  productivity_gain DECIMAL NOT NULL DEFAULT 0,
  skills_gained TEXT[] NOT NULL DEFAULT '{}',
  milestones TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Insert sample projects
INSERT INTO projects (title, description, domain, progress, skills, tools, productivity, timeframe, url) VALUES
('AI-Powered SaaS Dashboard', 'A comprehensive analytics dashboard built with AI insights and real-time data visualization for business intelligence.', 'https://dashboard.example.com', 85, ARRAY['React', 'TypeScript', 'AI Integration', 'Data Visualization'], ARRAY['ChatGPT', 'Vercel', 'Supabase'], 3.2, '3 months', 'https://github.com/example/dashboard'),
('E-commerce Automation Suite', 'Automated inventory management and customer service system using AI chatbots and predictive analytics.', 'https://ecommerce.example.com', 92, ARRAY['Node.js', 'AI Automation', 'Database Design', 'API Development'], ARRAY['OpenAI API', 'Shopify', 'Airtable'], 4.1, '4 months', 'https://github.com/example/ecommerce'),
('Personal Finance Tracker', 'Smart budgeting app with AI-powered expense categorization and financial advice recommendations.', 'https://finance.example.com', 78, ARRAY['React Native', 'Machine Learning', 'Financial APIs', 'Mobile Development'], ARRAY['ChatGPT', 'Plaid API', 'Firebase'], 2.8, '2 months', 'https://github.com/example/finance'),
('Social Media Analytics Tool', 'Comprehensive social media management platform with AI-driven content suggestions and performance analytics.', 'https://social.example.com', 95, ARRAY['Vue.js', 'Data Analytics', 'Social Media APIs', 'Content Strategy'], ARRAY['GPT-4', 'Twitter API', 'Instagram API'], 3.7, '5 months', 'https://github.com/example/social'),
('Bannaa - Arabic AI School', 'An innovative AI-powered educational platform designed to teach Arabic language and culture through interactive lessons.', 'https://bannaa.com', 15, ARRAY['Next.js', 'AI Education', 'Language Processing', 'Content Creation'], ARRAY['OpenAI', 'Vercel', 'Supabase'], 0.1, '1 month', 'https://bannaa.com')
ON CONFLICT DO NOTHING;

-- Insert sample metrics
INSERT INTO metrics (month, year, twitter_followers, linkedin_followers, newsletter_subscribers, total_gmv, productivity_gain, skills_gained, milestones) VALUES
('January', 2024, 1250, 890, 450, 12500.00, 2.1, ARRAY['React Hooks', 'TypeScript'], ARRAY['Launched first SaaS product', 'Reached 1000 followers']),
('February', 2024, 1380, 920, 520, 18750.00, 2.4, ARRAY['AI Integration', 'Database Optimization'], ARRAY['First paying customer', 'Featured in tech blog']),
('March', 2024, 1520, 1050, 680, 24200.00, 2.8, ARRAY['Advanced Analytics', 'Mobile Development'], ARRAY['$20k MRR milestone', 'Team expansion']),
('April', 2024, 1680, 1180, 820, 31500.00, 3.2, ARRAY['Machine Learning', 'API Design'], ARRAY['Product-market fit', 'Series A preparation']),
('May', 2024, 1850, 1320, 950, 38900.00, 3.5, ARRAY['DevOps', 'Security'], ARRAY['International expansion', 'Partnership deals'])
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metrics_updated_at BEFORE UPDATE ON metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
