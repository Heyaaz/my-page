import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPostBySlug } from '@/lib/supabase/queries'
import { createStaticClient } from '@/lib/supabase/static'
import { buildPostMetadata } from '@/lib/seo/metadata'
import { formatDate } from '@/lib/utils/date'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'

type Props = { params: Promise<{ slug: string }> }

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
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return buildPostMetadata(post.title, post.excerpt, post.cover_image_url ?? undefined)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="max-w-2xl mx-auto px-6 py-20">
      {post.category && (
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
          {post.category}
        </p>
      )}
      <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>
      <div className="flex items-center gap-4 text-sm text-neutral-400 mb-12 pb-8 border-b border-neutral-100">
        {post.published_at && (
          <span>{formatDate(post.published_at)}</span>
        )}
        {post.reading_time && <span>{post.reading_time}분 읽기</span>}
      </div>

      <MarkdownRenderer content={post.content} />
    </article>
  )
}
