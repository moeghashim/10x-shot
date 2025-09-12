# Database Setup Instructions

## Setting Up the Admin System

### 1. Run the Database Schema

Connect to your Supabase database and run the SQL schema from `lib/database-schema.sql`:

```sql
-- Copy and paste the contents of lib/database-schema.sql into your Supabase SQL editor
```

This will create:
- `projects` table for managing project details
- `project_metrics` table for month-over-month tracking
- Proper indexes and constraints
- Row Level Security policies
- Sample data from existing projects

### 2. Enable Authentication

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Enable "Enable email confirmations" if you want email verification
3. Set up authentication providers as needed

### 3. Set Up Admin Access

Option A: Create admin user via Supabase Dashboard
1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password for your admin account

Option B: Create admin user via the app
1. Visit `/admin` on your deployed site
2. Click "Need an account? Sign up"
3. Create your admin account

### 4. Test the Admin System

1. Visit `/admin` on your site
2. Sign in with your admin credentials
3. Use the Project Management tab to:
   - Edit existing project details
   - Add new projects
   - Update progress and productivity scores

4. Use the Metrics Tracking tab to:
   - Add monthly metrics for any project
   - Track progress over time
   - Monitor productivity trends

## Database Schema Overview

### Projects Table
- Core project information (title, domain, description)
- Progress tracking (0-100%)
- Skills arrays (my_skills, ai_skills)
- Tools array
- Productivity scoring (0-10)
- Status (planning, active, completed)

### Project Metrics Table
- Monthly snapshots per project
- Progress tracking over time
- Productivity scoring over time
- Hour tracking (total, AI-assisted, manual)
- Notes for qualitative tracking
- Unique constraint on project_id + month

### Security
- Row Level Security enabled
- Public read access for main site
- Authenticated user access for admin functions
- All admin operations require authentication

## Usage Tips

1. **Monthly Tracking**: Add metrics at the end of each month for accurate trends
2. **Hour Tracking**: Track AI vs manual hours to measure AI efficiency
3. **Progress Updates**: Update project progress regularly through either interface
4. **Notes**: Use the notes field to capture qualitative insights each month