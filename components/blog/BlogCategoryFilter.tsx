'use client'

import { useMemo, useState } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import { ALL_BLOG_CATEGORIES_LABEL, getBlogCategories } from '@/lib/blog/categories'
import type { BlogPostSummary } from '@/types/blog'

type Props = {
  posts: BlogPostSummary[]
}

export default function BlogCategoryFilter({ posts }: Props) {
  const categories = useMemo(() => getBlogCategories(posts), [posts])
  const [selectedCategory, setSelectedCategory] = useState(ALL_BLOG_CATEGORIES_LABEL)

  const filteredPosts = useMemo(() => {
    if (selectedCategory === ALL_BLOG_CATEGORIES_LABEL) {
      return posts
    }

    return posts.filter((post) => post.category?.trim() === selectedCategory)
  }, [posts, selectedCategory])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {[ALL_BLOG_CATEGORIES_LABEL, ...categories].map((category) => {
          const active = category === selectedCategory

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-colors',
                active
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900',
              ].join(' ')}
              aria-pressed={active}
            >
              {category}
            </button>
          )
        })}
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-neutral-400 text-sm">해당 카테고리에는 아직 작성된 글이 없습니다.</p>
      ) : (
        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
