/**
 * Test to verify project updates persist to database
 * 
 * Run this test to ensure:
 * 1. Projects can be updated
 * 2. Updates are saved to the database
 * 3. Updates persist after refetching from database
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { saveProject, fetchProjects } from '@/lib/data-fetching'
import type { Project } from '@/types/database'

async function testProjectUpdatePersistence() {
  console.log('🧪 Testing project update persistence...\n')

  // Step 1: Fetch current projects
  console.log('📖 Step 1: Fetching projects from database (no fallback)...')
  const { data: initialProjects, error: fetchError } = await fetchProjects({ allowFallback: false })
  
  if (fetchError) {
    console.error('❌ Failed to fetch projects:', fetchError)
    return false
  }

  if (!initialProjects || initialProjects.length === 0) {
    console.error('❌ No projects found in database')
    return false
  }

  console.log(`✅ Found ${initialProjects.length} projects\n`)

  // Step 2: Update the first project
  const projectToUpdate = initialProjects[0]
  const originalTitle = projectToUpdate.title
  const testTitle = `${originalTitle} - UPDATED ${Date.now()}`
  
  console.log(`📝 Step 2: Updating project "${originalTitle}"...`)
  console.log(`   New title: "${testTitle}"`)
  
  const updatedProject: Project = {
    ...projectToUpdate,
    title: testTitle,
    description: `Test update at ${new Date().toISOString()}`
  }

  const { data: savedData, error: saveError } = await saveProject(updatedProject)
  
  if (saveError) {
    console.error('❌ Failed to save project:', saveError)
    return false
  }

  if (!savedData) {
    console.error('❌ No data returned from save operation')
    return false
  }

  console.log(`✅ Project saved, returned data title: "${savedData.title}"\n`)

  // Step 3: Refetch from database to verify persistence
  console.log('🔄 Step 3: Refetching from database to verify...')
  const { data: refetchedProjects, error: refetchError } = await fetchProjects({ allowFallback: false })
  
  if (refetchError) {
    console.error('❌ Failed to refetch projects:', refetchError)
    return false
  }

  const refetchedProject = refetchedProjects?.find(p => p.id === projectToUpdate.id)
  
  if (!refetchedProject) {
    console.error('❌ Project not found after refetch')
    return false
  }

  console.log(`   Refetched title: "${refetchedProject.title}"`)

  // Step 4: Verify the update persisted
  if (refetchedProject.title !== testTitle) {
    console.error('❌ FAILED: Title did not persist!')
    console.error(`   Expected: "${testTitle}"`)
    console.error(`   Got: "${refetchedProject.title}"`)
    return false
  }

  console.log('✅ Update persisted correctly!\n')

  // Step 5: Restore original title
  console.log('🔄 Step 4: Restoring original title...')
  const restoredProject: Project = {
    ...refetchedProject,
    title: originalTitle,
    description: projectToUpdate.description
  }

  const { error: restoreError } = await saveProject(restoredProject)
  
  if (restoreError) {
    console.warn('⚠️  Warning: Failed to restore original title:', restoreError)
  } else {
    console.log('✅ Original title restored\n')
  }

  return true
}

// Run the test
testProjectUpdatePersistence()
  .then(success => {
    if (success) {
      console.log('🎉 All tests passed!')
      process.exit(0)
    } else {
      console.log('💥 Tests failed!')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('💥 Test error:', error)
    process.exit(1)
  })
