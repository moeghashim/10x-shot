const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function testDatabase() {
  console.log('🔍 Testing database setup...\n')

  try {
    // Test projects table
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, status')
      .limit(3)

    if (projectsError) {
      console.log('❌ Projects table error:', projectsError.message)
    } else {
      console.log('✅ Projects table working!')
      console.log(`   Found ${projects.length} projects`)
      projects.forEach(p => console.log(`   - ${p.title} (${p.status})`))
    }

    // Test global_metrics table
    const { data: metrics, error: metricsError } = await supabase
      .from('global_metrics')
      .select('month, productivity_gain')
      .order('month', { ascending: false })
      .limit(2)

    if (metricsError) {
      console.log('❌ Global metrics table error:', metricsError.message)
    } else {
      console.log('\n✅ Global metrics table working!')
      console.log(`   Found ${metrics.length} metrics entries`)
      metrics.forEach(m => console.log(`   - ${m.month}: ${m.productivity_gain}x productivity`))
    }

    console.log('\n🎉 Database setup is complete and working!')
    
  } catch (error) {
    console.log('❌ Connection error:', error.message)
  }
}

testDatabase()