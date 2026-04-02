import { Tag } from './shared'

export type PortfolioProject = {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  cover_image_url: string | null
  role: string | null
  stack: string[]
  duration: string | null
  status: string | null
  project_url: string | null
  github_url: string | null
  outcome: string | null
  is_published: boolean
  is_featured: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export type PortfolioProjectSummary = Pick<
  PortfolioProject,
  'id' | 'slug' | 'title' | 'summary' | 'cover_image_url' | 'role' | 'stack' | 'is_featured' | 'published_at'
> & { tags?: Tag[] }
