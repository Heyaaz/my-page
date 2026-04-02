import type { BlogPostSummary } from '@/types/blog'

export const DEFAULT_BLOG_CATEGORIES = ['기록', '회고', '생각', '기술'] as const
export const ALL_BLOG_CATEGORIES_LABEL = '전체'

export function getBlogCategories(posts: BlogPostSummary[]) {
  const categories = new Set<string>(DEFAULT_BLOG_CATEGORIES)

  for (const post of posts) {
    const category = post.category?.trim()
    if (category) {
      categories.add(category)
    }
  }

  return Array.from(categories)
}
