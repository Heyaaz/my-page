import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/supabase/queries'
import { createStaticClient } from '@/lib/supabase/static'
import { buildPostMetadata } from '@/lib/seo/metadata'
import { formatDate } from '@/lib/utils/date'
import { getBlogCategoryStyle } from '@/lib/blog/categories'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import DetailThemeScope from '@/components/ui/DetailThemeScope'

type Props = { params: Promise<{ slug: string }> }

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

export const dynamicParams = true

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true)
  return (data ?? []).map((p) => ({ slug: p.slug }))
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

  return (
    <DetailThemeScope mobileMaxWidthClass="max-w-2xl">
      <article className="max-w-2xl mx-auto px-6 py-20 text-[color:var(--detail-panel-foreground)] transition-colors duration-300">
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
    </DetailThemeScope>
  )
}
