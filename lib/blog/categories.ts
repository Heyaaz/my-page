export const DEFAULT_BLOG_CATEGORIES = ['기록', '회고', '생각', '기술'] as const
export const ALL_BLOG_CATEGORIES_LABEL = '전체'

const BLOG_CATEGORY_STYLES: Record<string, { badge: string; text: string }> = {
  기록: {
    badge: 'bg-amber-50 text-amber-700 ring-amber-200/80',
    text: 'text-amber-700',
  },
  회고: {
    badge: 'bg-sky-50 text-sky-700 ring-sky-200/80',
    text: 'text-sky-700',
  },
  생각: {
    badge: 'bg-violet-50 text-violet-700 ring-violet-200/80',
    text: 'text-violet-700',
  },
  기술: {
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200/80',
    text: 'text-emerald-700',
  },
}

const DEFAULT_CATEGORY_STYLE = {
  badge: 'bg-neutral-100 text-neutral-700 ring-neutral-200/80',
  text: 'text-neutral-600',
}

export function getBlogCategoryStyle(category: string | null | undefined) {
  if (!category) return DEFAULT_CATEGORY_STYLE
  return BLOG_CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE
}
