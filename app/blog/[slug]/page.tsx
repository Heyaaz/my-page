import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/supabase/queries'
import { buildPostMetadata } from '@/lib/seo/metadata'
import { formatDate } from '@/lib/utils/date'
import { getBlogCategoryStyle } from '@/lib/blog/categories'
import { extractMarkdownHeadings } from '@/lib/markdown/headings'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import DetailThemeScope from '@/components/ui/DetailThemeScope'
import DetailTableOfContents from '@/components/ui/DetailTableOfContents'

type Props = { params: Promise<{ slug: string }> }

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const normalizedSlug = normalizeSlug(slug)
  const post = await getPostBySlug(normalizedSlug)
  if (!post) return {}
  return buildPostMetadata(post.title, post.excerpt, post.cover_image_url ?? undefined)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const normalizedSlug = normalizeSlug(slug)
  const post = await getPostBySlug(normalizedSlug)
  if (!post) notFound()

  const categoryStyle = getBlogCategoryStyle(post.category)
  const headings = extractMarkdownHeadings(post.content)

  return (
    <DetailThemeScope mobileMaxWidthClass="max-w-2xl">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 xl:grid-cols-[minmax(0,42rem)_16rem] xl:justify-center">
        <article className="mx-auto w-full max-w-2xl py-20 text-[color:var(--detail-panel-foreground)] transition-colors duration-300">
          {post.category && (
            <p className={[
              'mb-4 text-xs font-medium uppercase tracking-widest',
              categoryStyle.text,
            ].join(' ')}>
              {post.category}
            </p>
          )}
          <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[color:var(--detail-muted)] mb-12 pb-8 border-b border-[color:var(--detail-divider)] transition-colors duration-300">
            {post.published_at && (
              <span>{formatDate(post.published_at)}</span>
            )}
            {post.reading_time && <span>{post.reading_time}분 읽기</span>}
          </div>

          <MarkdownRenderer content={post.content} />
        </article>
        <DetailTableOfContents headings={headings} />
      </div>
    </DetailThemeScope>
  )
}
