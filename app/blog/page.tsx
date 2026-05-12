import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter'
import { ALL_BLOG_CATEGORIES_LABEL } from '@/lib/blog/categories'
import { BLOG_POSTS_PER_PAGE, getPostsPage, getPublishedBlogCategories } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Blog',
  description: '생각, 기록, 회고, 기술 이야기를 씁니다.',
}

type BlogPageProps = {
  searchParams: Promise<{
    category?: string | string[]
    page?: string | string[]
  }>
}

function getSearchParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function parsePage(value: string | string[] | undefined) {
  const page = Number(getSearchParamValue(value) ?? '1')
  return Number.isInteger(page) && page > 0 ? page : 1
}

function buildBlogRedirectHref(category: string, page: number) {
  const params = new URLSearchParams()

  if (category !== ALL_BLOG_CATEGORIES_LABEL) {
    params.set('category', category)
  }

  if (page > 1) {
    params.set('page', String(page))
  }

  const query = params.toString()
  return query ? `/blog?${query}` : '/blog'
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const query = await searchParams
  const requestedCategory = getSearchParamValue(query.category)?.trim()
  const currentPage = parsePage(query.page)
  const selectedCategory = requestedCategory || ALL_BLOG_CATEGORIES_LABEL
  const categoryFilter = selectedCategory === ALL_BLOG_CATEGORIES_LABEL ? null : selectedCategory
  const [categories, paginatedPosts] = await Promise.all([
    getPublishedBlogCategories(),
    getPostsPage({
      page: currentPage,
      perPage: BLOG_POSTS_PER_PAGE,
      category: categoryFilter,
    }),
  ])

  if (paginatedPosts.total > 0 && currentPage > paginatedPosts.totalPages) {
    redirect(buildBlogRedirectHref(selectedCategory, paginatedPosts.totalPages))
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Blog</h1>
      <p className="mb-12 text-neutral-500">생각, 기록, 회고, 기술 이야기를 씁니다.</p>

      {paginatedPosts.total === 0 && selectedCategory === ALL_BLOG_CATEGORIES_LABEL ? (
        <p className="text-sm text-neutral-400">아직 작성된 글이 없습니다.</p>
      ) : (
        <BlogCategoryFilter
          posts={paginatedPosts.posts}
          categories={categories}
          selectedCategory={selectedCategory}
          currentPage={paginatedPosts.page}
          totalPosts={paginatedPosts.total}
          totalPages={paginatedPosts.totalPages}
        />
      )}
    </div>
  )
}
