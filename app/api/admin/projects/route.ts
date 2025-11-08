/**
 * API route for admin project operations
 * Handles create, update, and delete operations using service role key
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { mapAppProjectToDb, mapDbProjectToApp } from '@/lib/constants'
import type { Project } from '@/types/database'

/**
 * POST - Create or update a project
 */
export async function POST(request: NextRequest) {
  try {
    const project: Omit<Project, 'id'> | Project = await request.json()
    const dbProject = mapAppProjectToDb(project)

    if ('id' in project && project.id) {
      // Update existing project
      const { data, error } = await supabaseAdmin
        .from('projects')
        .update(dbProject)
        .eq('id', project.id)
        .select()

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      if (data && data[0]) {
        return NextResponse.json({ data: mapDbProjectToApp(data[0]) })
      }

      return NextResponse.json(
        { error: 'Failed to update project' },
        { status: 400 }
      )
    } else {
      // Create new project
      const { data, error } = await supabaseAdmin
        .from('projects')
        .insert([dbProject])
        .select()

      if (error) {
        console.error("Database error:", error)
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }

      if (data && data[0]) {
        return NextResponse.json({ data: mapDbProjectToApp(data[0]) })
      }

      return NextResponse.json(
        { error: 'Failed to create project' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Failed to save project:", error)
    return NextResponse.json(
      { error: error.message || 'Failed to save project' },
      { status: 500 }
    )
  }
}

/**
 * GET - Fetch all projects (no fallback)
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('Database error in fetchProjects:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    const mappedProjects = (data || []).map(mapDbProjectToApp)
    return NextResponse.json({ data: mappedProjects })
  } catch (error: any) {
    console.error('Database connection failed:', error)
    return NextResponse.json(
      { error: error.message || 'Database connection failed' },
      { status: 500 }
    )
  }
}
