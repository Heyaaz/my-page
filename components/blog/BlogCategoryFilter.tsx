'use client'

import { useMemo, useState } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import { ALL_BLOG_CATEGORIES_LABEL, getBlogCategories } from '@/lib/blog/categories'
import type { BlogPostSummary } from '@/types/blog'

type Props = {
  posts: BlogPostSummary[]
}

const POSTS_PER_PAGE = 10
const PAGE_WINDOW_SIZE = 5

export default function BlogCategoryFilter({ posts }: Props) {
  const categories = useMemo(() => getBlogCategories(posts), [posts])
  const [selectedCategory, setSelectedCategory] = useState(ALL_BLOG_CATEGORIES_LABEL)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPosts = useMemo(() => {
    if (selectedCategory === ALL_BLOG_CATEGORIES_LABEL) {
      return posts
    }

    return posts.filter((post) => post.category?.trim() === selectedCategory)
  }, [posts, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedPosts = useMemo(() => {
    const start = (safeCurrentPage - 1) * POSTS_PER_PAGE
    return filteredPosts.slice(start, start + POSTS_PER_PAGE)
  }, [filteredPosts, safeCurrentPage])

  const currentWindow = Math.floor((safeCurrentPage - 1) / PAGE_WINDOW_SIZE)
  const windowStart = currentWindow * PAGE_WINDOW_SIZE + 1
  const windowEnd = Math.min(windowStart + PAGE_WINDOW_SIZE - 1, totalPages)
  const visiblePages = Array.from({ length: windowEnd - windowStart + 1 }, (_, index) => windowStart + index)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {[ALL_BLOG_CATEGORIES_LABEL, ...categories].map((category) => {
          const active = category === selectedCategory

          return (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSelectedCategory(category)
                setCurrentPage(1)
              }}
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

      <div className="min-h-[60vh]">
        {filteredPosts.length === 0 ? (
          <div className="flex h-full min-h-[60vh] items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/60 px-6 text-center">
            <p className="text-sm text-neutral-400">해당 카테고리에는 아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between gap-4 text-sm text-neutral-400">
              <p>
                총 {filteredPosts.length}개 글 · {safeCurrentPage}/{totalPages} 페이지
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>

      {filteredPosts.length > 0 && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safeCurrentPage === 1}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            이전
          </button>

          {windowStart > 1 && (
            <button
              type="button"
              onClick={() => setCurrentPage(windowStart - 1)}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
            >
              ...
            </button>
          )}

          {visiblePages.map((page) => {
            const active = page === safeCurrentPage

            return (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={[
                  'h-10 min-w-10 rounded-full border px-3 text-sm transition-colors',
                  active
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {page}
              </button>
            )
          })}

          {windowEnd < totalPages && (
            <button
              type="button"
              onClick={() => setCurrentPage(windowEnd + 1)}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
            >
              ...
            </button>
          )}

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={safeCurrentPage === totalPages}
            className="rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
