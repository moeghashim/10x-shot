#!/bin/bash

# Test script to verify project updates persist
# This runs the project update test

echo "Running project update persistence test..."
echo ""

# Load .env.local and run test
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found. Please create it with your Supabase credentials."
  exit 1
fi

# Export variables and run test
set -a
source .env.local
set +a

npx tsx tests/project-update.test.ts
