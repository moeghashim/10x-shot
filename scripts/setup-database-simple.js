const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

console.log(`
🔧 DATABASE SETUP INSTRUCTIONS

Since direct SQL execution via API has limitations, please follow these steps:

1. 📱 Open Supabase Dashboard:
   https://supabase.com/dashboard/project/lnxjbagnzfxxbeowozby

2. 🗂️ Click "SQL Editor" in the left sidebar

3. 📋 Copy and paste this complete schema:

`)

// Display the schema file contents
const fs = require('fs')
const path = require('path')
const schemaPath = path.join(__dirname, '..', 'lib', 'database-schema.sql')

try {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8')
  console.log('--- COPY FROM HERE ---')
  console.log(schemaContent)
  console.log('--- COPY TO HERE ---')
  
  console.log(`
4. ▶️ Click "Run" to execute the schema

5. ✅ Test the setup by running:
   node scripts/test-database.js

Your website is already working with fallback data, but setting up the database will enable:
- Admin panel functionality
- Real-time data updates
- Project management capabilities
`)

} catch (error) {
  console.error('Error reading schema file:', error.message)
}