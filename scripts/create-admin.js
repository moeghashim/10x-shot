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

async function createAdminUser() {
  const adminEmail = 'admin@10x.local'
  const adminPassword = 'admin123'
  
  try {
    // Create the user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    })

    if (error) {
      console.error('Error creating admin user:', error.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminEmail)
    console.log('🔒 Password:', adminPassword)
    console.log('🆔 User ID:', data.user.id)
    console.log('\nYou can now log in to /admin with these credentials.')

  } catch (err) {
    console.error('Error:', err.message)
  }
}

createAdminUser()