#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Read the migration SQL
const sql = 'ALTER TABLE projects ADD COLUMN IF NOT EXISTS objectives VARCHAR(150);';

console.log('Running migration...');
console.log('SQL:', sql);

const data = JSON.stringify({ query: sql });

const url = new URL(`${SUPABASE_URL}/rest/v1/rpc/exec`);
const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  }
};

const req = https.request(options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('\n✓ Migration completed successfully!');
    } else {
      console.log('\n✗ Migration failed. Please run the SQL manually in Supabase SQL Editor.');
      console.log('\nSQL to run:');
      console.log(sql);
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  console.log('\nPlease run this SQL manually in Supabase SQL Editor:');
  console.log(sql);
});

req.write(data);
req.end();
