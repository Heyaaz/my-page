import { createClient } from './server'
import { BlogPost, BlogPostSummary } from '@/types/blog'
import { PortfolioProject, PortfolioProjectSummary } from '@/types/portfolio'

const hasSupabase = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL

// Blog
export async function getFeaturedPosts(limit = 3): Promise<BlogPostSummary[]> {
  if (!hasSupabase()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, content, cover_image_url, category, published_at, is_featured, reading_time')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}

export async function getRecentPosts(limit = 5): Promise<BlogPostSummary[]> {
  if (!hasSupabase()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, content, cover_image_url, category, published_at, is_featured, reading_time')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}

export async function getAllPosts(): Promise<BlogPostSummary[]> {
  if (!hasSupabase()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, content, cover_image_url, category, published_at, is_featured, reading_time')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasSupabase()) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data
}

// Portfolio
export async function getFeaturedProjects(limit = 3): Promise<PortfolioProjectSummary[]> {
  if (!hasSupabase()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('id, slug, title, summary, cover_image_url, role, stack, duration, outcome, status, is_featured, published_at')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}

export async function getAllProjects(): Promise<PortfolioProjectSummary[]> {
  if (!hasSupabase()) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('id, slug, title, summary, cover_image_url, role, stack, duration, outcome, status, is_featured, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  if (!hasSupabase()) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data
}
