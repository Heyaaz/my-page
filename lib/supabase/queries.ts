import { unstable_cache } from 'next/cache'
import { createStaticClient } from './static'
import { BlogPost, BlogPostSummary } from '@/types/blog'
import { PortfolioProject, PortfolioProjectSummary } from '@/types/portfolio'

const CONTENT_CACHE_SECONDS = 300
export const BLOG_POSTS_PER_PAGE = 10

const hasSupabase = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export type PaginatedBlogPosts = {
  posts: BlogPostSummary[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// Blog
const getCachedFeaturedPosts = unstable_cache(async (limit: number): Promise<BlogPostSummary[]> => {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, content, cover_image_url, category, published_at, is_featured, reading_time')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}, ['featured-posts'], {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: ['blog_posts'],
})

export async function getFeaturedPosts(limit = 3): Promise<BlogPostSummary[]> {
  if (!hasSupabase()) return []
  return getCachedFeaturedPosts(limit)
}

const getCachedRecentPosts = unstable_cache(async (limit: number): Promise<BlogPostSummary[]> => {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, content, cover_image_url, category, published_at, is_featured, reading_time')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}, ['recent-posts'], {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: ['blog_posts'],
})

export async function getRecentPosts(limit = 5): Promise<BlogPostSummary[]> {
  if (!hasSupabase()) return []
  return getCachedRecentPosts(limit)
}

const getCachedPublishedBlogCategories = unstable_cache(async (): Promise<string[]> => {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('category')
    .eq('is_published', true)
    .order('category', { ascending: true })

  if (error) return []

  const categories = new Set<string>()
  for (const post of data ?? []) {
    const category = post.category?.trim()
    if (category) categories.add(category)
  }

  return Array.from(categories)
}, ['published-blog-categories'], {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: ['blog_posts'],
})

export async function getPublishedBlogCategories(): Promise<string[]> {
  if (!hasSupabase()) return []
  return getCachedPublishedBlogCategories()
}

const getCachedPostsPage = unstable_cache(async (
  page: number,
  perPage: number,
  category: string | null,
): Promise<PaginatedBlogPosts> => {
  const safePage = Math.max(1, page)
  const safePerPage = Math.max(1, perPage)
  const from = (safePage - 1) * safePerPage
  const to = from + safePerPage - 1

  const supabase = createStaticClient()
  let query = supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image_url, category, published_at, is_featured, reading_time', {
      count: 'exact',
    })
    .eq('is_published', true)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error, count } = await query
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error) {
    return {
      posts: [],
      total: 0,
      page: safePage,
      perPage: safePerPage,
      totalPages: 1,
    }
  }

  const total = count ?? 0

  return {
    posts: data ?? [],
    total,
    page: safePage,
    perPage: safePerPage,
    totalPages: Math.max(1, Math.ceil(total / safePerPage)),
  }
}, ['posts-page'], {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: ['blog_posts'],
})

export async function getPostsPage({
  page = 1,
  perPage = BLOG_POSTS_PER_PAGE,
  category = null,
}: {
  page?: number
  perPage?: number
  category?: string | null
} = {}): Promise<PaginatedBlogPosts> {
  if (!hasSupabase()) {
    return {
      posts: [],
      total: 0,
      page: Math.max(1, page),
      perPage,
      totalPages: 1,
    }
  }

  return getCachedPostsPage(page, perPage, category)
}

const getCachedPostBySlug = unstable_cache(async (slug: string): Promise<BlogPost | null> => {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data
}, ['post-by-slug'], {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: ['blog_posts'],
})

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasSupabase()) return null
  return getCachedPostBySlug(slug)
}

// Portfolio
const getCachedFeaturedProjects = unstable_cache(async (limit: number): Promise<PortfolioProjectSummary[]> => {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('id, slug, title, summary, cover_image_url, role, stack, duration, outcome, status, is_featured, published_at')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}, ['featured-projects'], {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: ['portfolio_projects'],
})

export async function getFeaturedProjects(limit = 3): Promise<PortfolioProjectSummary[]> {
  if (!hasSupabase()) return []
  return getCachedFeaturedProjects(limit)
}

const getCachedAllProjects = unstable_cache(async (): Promise<PortfolioProjectSummary[]> => {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('id, slug, title, summary, cover_image_url, role, stack, duration, outcome, status, is_featured, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) return []
  return data ?? []
}, ['all-projects'], {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: ['portfolio_projects'],
})

export async function getAllProjects(): Promise<PortfolioProjectSummary[]> {
  if (!hasSupabase()) return []
  return getCachedAllProjects()
}

const getCachedProjectBySlug = unstable_cache(async (slug: string): Promise<PortfolioProject | null> => {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from('portfolio_projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data
}, ['project-by-slug'], {
  revalidate: CONTENT_CACHE_SECONDS,
  tags: ['portfolio_projects'],
})

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  if (!hasSupabase()) return null
  return getCachedProjectBySlug(slug)
}
