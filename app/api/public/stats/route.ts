import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const [{ data: projects, error: projectsError }, { data: globalMetrics, error: metricsError }] =
      await Promise.all([
        supabaseAdmin
          .from('projects')
          .select('id, status, productivity, tools'),
        supabaseAdmin
          .from('global_metrics')
          .select('productivity_gain')
          .order('month', { ascending: false })
          .limit(1)
      ])

    if (projectsError) {
      console.error('Failed to fetch projects for stats:', projectsError)
      return NextResponse.json(
        { error: projectsError.message },
        { status: 500 }
      )
    }

    if (metricsError) {
      console.error('Failed to fetch global metrics for stats:', metricsError)
      return NextResponse.json(
        { error: metricsError.message },
        { status: 500 }
      )
    }

    const totalProjects = (projects || []).length
    const projectsLaunched = (projects || []).filter((project) =>
      ['active', 'completed'].includes((project.status || '').toLowerCase())
    ).length

    const avgProductivityGain = totalProjects
      ? (projects || []).reduce((sum, project) => sum + (project.productivity ?? 0), 0) /
        totalProjects
      : 0

    const aiToolsIntegrated = Array.from(
      new Set(
        (projects || []).flatMap((project) => project.tools ?? [])
      )
    ).length

    const currentProductivity =
      globalMetrics && globalMetrics.length > 0
        ? globalMetrics[0].productivity_gain ?? 0
        : avgProductivityGain

    return NextResponse.json({
      data: {
        projectsLaunched,
        totalProjects,
        avgProductivityGain,
        aiToolsIntegrated,
        currentProductivity
      }
    })
  } catch (error: any) {
    console.error('Unexpected error computing stats:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to compute stats' },
      { status: 500 }
    )
  }
}

