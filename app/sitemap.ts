import { MetadataRoute } from 'next'
import { fetchProjects } from '@/lib/data-fetching'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://10xbuilder.ai'
  
  // Fetch projects to include them in sitemap if they have unique URLs or to just ensure visibility
  const { data: projects } = await fetchProjects()
  
  const projectUrls = projects
    .filter(p => p.url && p.url.startsWith(baseUrl))
    .map(p => ({
      url: p.url,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/progress`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...projectUrls,
  ]
}

