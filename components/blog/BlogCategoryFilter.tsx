import Link from 'next/link'
import type { ReactNode } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import { ALL_BLOG_CATEGORIES_LABEL, DEFAULT_BLOG_CATEGORIES } from '@/lib/blog/categories'
import type { BlogPostSummary } from '@/types/blog'

type Props = {
  posts: BlogPostSummary[]
  categories: string[]
  selectedCategory: string
  currentPage: number
  totalPosts: number
  totalPages: number
}

const PAGE_WINDOW_SIZE = 5

function buildBlogHref({ category, page }: { category: string; page?: number }) {
  const params = new URLSearchParams()

  if (category !== ALL_BLOG_CATEGORIES_LABEL) {
    params.set('category', category)
  }

  if (page && page > 1) {
    params.set('page', String(page))
  }

  const query = params.toString()
  return query ? `/blog?${query}` : '/blog'
}

export default function BlogCategoryFilter({
  posts,
  categories,
  selectedCategory,
  currentPage,
  totalPosts,
  totalPages,
}: Props) {
  const categoryOptions = Array.from(new Set([
    ALL_BLOG_CATEGORIES_LABEL,
    ...DEFAULT_BLOG_CATEGORIES,
    ...categories,
  ]))
  const safeTotalPages = Math.max(1, totalPages)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages)
  const currentWindow = Math.floor((safeCurrentPage - 1) / PAGE_WINDOW_SIZE)
  const windowStart = currentWindow * PAGE_WINDOW_SIZE + 1
  const windowEnd = Math.min(windowStart + PAGE_WINDOW_SIZE - 1, safeTotalPages)
  const visiblePages = Array.from({ length: windowEnd - windowStart + 1 }, (_, index) => windowStart + index)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((category) => {
          const active = category === selectedCategory

          return (
            <Link
              key={category}
              href={buildBlogHref({ category })}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-colors',
                active
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900',
              ].join(' ')}
              aria-current={active ? 'page' : undefined}
            >
              {category}
            </Link>
          )
        })}
      </div>

      <div className="min-h-[60vh]">
        {posts.length === 0 ? (
          <div className="flex h-full min-h-[60vh] items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-neutral-50/60 px-6 text-center">
            <p className="text-sm text-neutral-400">해당 카테고리에는 아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between gap-4 text-sm text-neutral-400">
              <p>
                총 {totalPosts}개 글 · {safeCurrentPage}/{safeTotalPages} 페이지
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </div>

      {totalPosts > 0 && safeTotalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <PaginationLink
            disabled={safeCurrentPage === 1}
            href={buildBlogHref({ category: selectedCategory, page: safeCurrentPage - 1 })}
          >
            이전
          </PaginationLink>

          {windowStart > 1 && (
            <PaginationLink href={buildBlogHref({ category: selectedCategory, page: windowStart - 1 })}>
              ...
            </PaginationLink>
          )}

          {visiblePages.map((page) => {
            const active = page === safeCurrentPage

            return (
              <PaginationLink
                key={page}
                href={buildBlogHref({ category: selectedCategory, page })}
                active={active}
              >
                {page}
              </PaginationLink>
            )
          })}

          {windowEnd < safeTotalPages && (
            <PaginationLink href={buildBlogHref({ category: selectedCategory, page: windowEnd + 1 })}>
              ...
            </PaginationLink>
          )}

          <PaginationLink
            disabled={safeCurrentPage === safeTotalPages}
            href={buildBlogHref({ category: selectedCategory, page: safeCurrentPage + 1 })}
          >
            다음
          </PaginationLink>
        </div>
      )}
    </div>
  )
}

function PaginationLink({
  active = false,
  disabled = false,
  href,
  children,
}: {
  active?: boolean
  disabled?: boolean
  href: string
  children: ReactNode
}) {
  const className = [
    'inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition-colors',
    active
      ? 'border-neutral-900 bg-neutral-900 text-white'
      : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900',
    disabled ? 'pointer-events-none opacity-40' : '',
  ].join(' ')

  return (
    <Link
      href={href}
      className={className}
      aria-current={active ? 'page' : undefined}
      aria-disabled={disabled ? true : undefined}
      tabIndex={disabled ? -1 : undefined}
    >
      {children}
    </Link>
  )
}
