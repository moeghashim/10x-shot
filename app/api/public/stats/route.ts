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
    
    // Filter active/completed projects - handle both string and case variations
    const activeProjects = (projects || []).filter((project) => {
      const status = String(project.status || '').toLowerCase().trim()
      return status === 'active' || status === 'completed'
    })
    const projectsLaunched = activeProjects.length

    // Average productivity from ALL projects (for the "Avg Productivity Gain" stat)
    // Convert productivity to number, defaulting to 0 if null/undefined
    const avgProductivityGain = totalProjects > 0
      ? (projects || []).reduce((sum, project) => {
          const prod = Number(project.productivity) || 0
          return sum + prod
        }, 0) / totalProjects
      : 0

    // Current Productivity should be the average from ACTIVE/COMPLETED projects only
    // This reflects the productivity of projects that are actually running
    const currentProductivity = activeProjects.length > 0
      ? activeProjects.reduce((sum, project) => {
          const prod = Number(project.productivity) || 0
          return sum + prod
        }, 0) / activeProjects.length
      : avgProductivityGain // Fallback to overall average if no active projects

    const aiToolsIntegrated = Array.from(
      new Set(
        (projects || []).flatMap((project) => project.tools ?? [])
      )
    ).length

    // Debug logging (remove in production)
    console.log('Stats calculation:', {
      totalProjects,
      allProjects: (projects || []).map(p => ({ id: p.id, status: p.status, productivity: p.productivity })),
      activeProjectsCount: activeProjects.length,
      activeProductivities: activeProjects.map(p => ({ id: p.id, status: p.status, productivity: p.productivity })),
      avgProductivityGain,
      currentProductivity
    })

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

