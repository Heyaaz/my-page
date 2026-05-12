import { Tag } from './shared'

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image_url: string | null
  category: string | null
  published_at: string | null
  is_published: boolean
  is_featured: boolean
  reading_time: number | null
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export type BlogPostSummary = Pick<
  BlogPost,
  'id' | 'slug' | 'title' | 'excerpt' | 'cover_image_url' | 'category' | 'published_at' | 'is_featured' | 'reading_time'
> & {
  content?: string
  tags?: Tag[]
}
