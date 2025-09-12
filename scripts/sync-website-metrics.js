const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Website progress data from progress-tracker.tsx
const progressData = [
  {
    month: "2024-01-01",
    metrics: {
      twitterFollowers: 1250,
      youtubeSubscribers: 340,
      tiktokFollowers: 890,
      instagramFollowers: 2100,
      newsletterSubscribers: 450,
      totalGMV: 12500,
      productivityGain: 2.1,
    },
    skillsGained: ["Basic Design Principles"],
    milestones: ["Started 10x experiment", "Launched first project"],
  },
  {
    month: "2024-02-01",
    metrics: {
      twitterFollowers: 1580,
      youtubeSubscribers: 520,
      tiktokFollowers: 1340,
      instagramFollowers: 2650,
      newsletterSubscribers: 680,
      totalGMV: 18900,
      productivityGain: 3.4,
    },
    skillsGained: ["Figma Basics", "Team Management"],
    milestones: ["Reached 500 YouTube subscribers", "First $15k month"],
  },
  {
    month: "2024-03-01",
    metrics: {
      twitterFollowers: 2100,
      youtubeSubscribers: 780,
      tiktokFollowers: 1890,
      instagramFollowers: 3200,
      newsletterSubscribers: 920,
      totalGMV: 25600,
      productivityGain: 4.8,
    },
    skillsGained: ["Advanced Design Systems", "Vibe Coding Fundamentals"],
    milestones: ["2k Twitter followers", "Launched Bannaa.ai"],
  },
  {
    month: "2024-04-01",
    metrics: {
      twitterFollowers: 2850,
      youtubeSubscribers: 1100,
      tiktokFollowers: 2450,
      instagramFollowers: 4100,
      newsletterSubscribers: 1250,
      totalGMV: 34200,
      productivityGain: 6.2,
    },
    skillsGained: ["Project Management", "Advanced Vibe Coding"],
    milestones: ["1k YouTube subscribers", "First viral TikTok"],
  },
  {
    month: "2024-05-01",
    metrics: {
      twitterFollowers: 3600,
      youtubeSubscribers: 1450,
      tiktokFollowers: 3200,
      instagramFollowers: 5300,
      newsletterSubscribers: 1680,
      totalGMV: 42800,
      productivityGain: 7.9,
    },
    skillsGained: ["UI/UX Design", "Team Leadership"],
    milestones: ["5k Instagram followers", "$40k month"],
  },
  {
    month: "2024-06-01",
    metrics: {
      twitterFollowers: 4200,
      youtubeSubscribers: 1850,
      tiktokFollowers: 4100,
      instagramFollowers: 6800,
      newsletterSubscribers: 2100,
      totalGMV: 51500,
      productivityGain: 9.1,
    },
    skillsGained: ["Advanced Management", "Full-Stack Vibe Coding"],
    milestones: ["4k Twitter followers", "2k Newsletter subscribers"],
  },
]

async function createGlobalMetricsTable() {
  console.log('ℹ️  Please run the following SQL in your Supabase SQL editor first:')
  console.log(`
-- Create global metrics table for overall progress tracking
CREATE TABLE IF NOT EXISTS global_metrics (
  id SERIAL PRIMARY KEY,
  month DATE NOT NULL UNIQUE,
  twitter_followers INTEGER DEFAULT 0,
  youtube_subscribers INTEGER DEFAULT 0,
  tiktok_followers INTEGER DEFAULT 0,
  instagram_followers INTEGER DEFAULT 0,
  newsletter_subscribers INTEGER DEFAULT 0,
  total_gmv DECIMAL(10,2) DEFAULT 0,
  productivity_gain DECIMAL(3,1) DEFAULT 0,
  skills_gained TEXT[] DEFAULT '{}',
  milestones TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add update trigger for global_metrics
CREATE TRIGGER update_global_metrics_updated_at 
  BEFORE UPDATE ON global_metrics 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
  
-- Enable RLS for global_metrics
ALTER TABLE global_metrics ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated users full access to global_metrics" 
  ON global_metrics FOR ALL 
  USING (auth.role() = 'authenticated');
  
-- Allow public read access
CREATE POLICY "Allow public read access to global_metrics" 
  ON global_metrics FOR SELECT 
  USING (true);
  `)

  // Test if table exists by trying to query it
  const { error: testError } = await supabase
    .from('global_metrics')
    .select('id')
    .limit(1)

  if (testError) {
    console.error('❌ Table does not exist. Please create it first using the SQL above.')
    return false
  }

  return true
}

async function syncProgressData() {
  console.log('🔄 Syncing website metrics to database...')

  // First create the table
  const tableCreated = await createGlobalMetricsTable()
  if (!tableCreated) {
    console.error('❌ Failed to create global_metrics table')
    return
  }

  try {
    // Clear existing data
    const { error: deleteError } = await supabase
      .from('global_metrics')
      .delete()
      .neq('id', 0) // Delete all records

    if (deleteError) {
      console.error('Error clearing existing data:', deleteError)
      return
    }

    // Insert new data
    for (const monthData of progressData) {
      const { error } = await supabase
        .from('global_metrics')
        .insert({
          month: monthData.month,
          twitter_followers: monthData.metrics.twitterFollowers,
          youtube_subscribers: monthData.metrics.youtubeSubscribers,
          tiktok_followers: monthData.metrics.tiktokFollowers,
          instagram_followers: monthData.metrics.instagramFollowers,
          newsletter_subscribers: monthData.metrics.newsletterSubscribers,
          total_gmv: monthData.metrics.totalGMV,
          productivity_gain: monthData.metrics.productivityGain,
          skills_gained: monthData.skillsGained,
          milestones: monthData.milestones
        })

      if (error) {
        console.error(`Error inserting data for ${monthData.month}:`, error)
        continue
      }

      console.log(`✅ Synced data for ${monthData.month}`)
    }

    console.log('🎉 Successfully synced all website metrics to database!')

  } catch (err) {
    console.error('Error syncing data:', err)
  }
}

// Run the sync
syncProgressData()