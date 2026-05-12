import Link from 'next/link'
import Image from 'next/image'
import { BlogPostSummary } from '@/types/blog'
import { formatDate } from '@/lib/utils/date'
import { getBlogPreviewImage, getBlogPreviewText } from '@/lib/blog/preview'
import { getBlogCategoryStyle } from '@/lib/blog/categories'

const DEFAULT_PREVIEW_TEXT = '본문에서 자세한 내용을 확인해보세요.'

const FALLBACK_THUMBNAIL_STYLES: Record<string, {
  frame: string
  badge: string
  accent: string
  line: string
}> = {
  기록: {
    frame: 'bg-gradient-to-br from-amber-50 via-white to-orange-50',
    badge: 'bg-amber-100/80 text-amber-700 ring-amber-200',
    accent: 'bg-amber-300',
    line: 'bg-amber-200/70',
  },
  회고: {
    frame: 'bg-gradient-to-br from-sky-50 via-white to-blue-50',
    badge: 'bg-sky-100/80 text-sky-700 ring-sky-200',
    accent: 'bg-sky-300',
    line: 'bg-sky-200/70',
  },
  생각: {
    frame: 'bg-gradient-to-br from-violet-50 via-white to-fuchsia-50',
    badge: 'bg-violet-100/80 text-violet-700 ring-violet-200',
    accent: 'bg-violet-300',
    line: 'bg-violet-200/70',
  },
  기술: {
    frame: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    badge: 'bg-emerald-100/80 text-emerald-700 ring-emerald-200',
    accent: 'bg-emerald-300',
    line: 'bg-emerald-200/70',
  },
}

const DEFAULT_FALLBACK_THUMBNAIL_STYLE = {
  frame: 'bg-gradient-to-br from-neutral-50 via-white to-neutral-100',
  badge: 'bg-white/80 text-neutral-600 ring-neutral-200',
  accent: 'bg-neutral-300',
  line: 'bg-neutral-200',
}

function getFallbackThumbnailStyle(category: string | null | undefined) {
  if (!category) return DEFAULT_FALLBACK_THUMBNAIL_STYLE
  return FALLBACK_THUMBNAIL_STYLES[category] ?? DEFAULT_FALLBACK_THUMBNAIL_STYLE
}

export default function BlogCard({ post }: { post: BlogPostSummary }) {
  const previewImage = getBlogPreviewImage(post)
  const previewText = getBlogPreviewText(post)
  const categoryStyle = getBlogCategoryStyle(post.category)

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="relative aspect-[16/10] bg-neutral-50">
          {previewImage ? (
            <Image
              src={previewImage}
              alt={post.title}
              fill
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <BlogFallbackThumbnail title={post.title} category={post.category} />
          )}
          {post.category && (
            <div className="absolute left-4 top-4">
              <span className={[
                'inline-flex rounded-full px-3 py-1 text-xs font-medium shadow-sm ring-1 backdrop-blur-sm',
                categoryStyle.badge,
              ].join(' ')}>
                {post.category}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
            {post.category && <span className={['font-medium', categoryStyle.text].join(' ')}>{post.category}</span>}
            {post.published_at && <span>{formatDate(post.published_at)}</span>}
            {post.reading_time && <span>{post.reading_time}분</span>}
          </div>

          <h2 className="mb-3 text-xl font-semibold leading-snug tracking-tight text-neutral-900 group-hover:underline">
            {post.title}
          </h2>

          <p className="line-clamp-4 text-sm leading-relaxed text-neutral-500">
            {previewText || DEFAULT_PREVIEW_TEXT}
          </p>

          <div className="mt-6 text-sm font-medium text-neutral-900">
            자세히 보기 →
          </div>
        </div>
      </article>
    </Link>
  )
}

function BlogFallbackThumbnail({
  title,
  category,
}: {
  title: string
  category: string | null
}) {
  const style = getFallbackThumbnailStyle(category)

  return (
    <div className={[
      'absolute inset-0 overflow-hidden px-8 py-10',
      style.frame,
    ].join(' ')}>
      <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-white/70 blur-2xl" />
      <div className="absolute -bottom-20 left-8 h-40 w-40 rounded-full bg-white/60 blur-2xl" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className={[
            'inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ring-1',
            style.badge,
          ].join(' ')}>
            BLOG
          </span>
          <span className={['h-2 w-10 rounded-full', style.accent].join(' ')} />
        </div>

        <div>
          <p className="mb-4 line-clamp-2 text-2xl font-bold leading-tight tracking-tight text-neutral-900">
            {title}
          </p>
          <div className="space-y-2">
            <span className={['block h-2 w-2/3 rounded-full', style.line].join(' ')} />
            <span className={['block h-2 w-1/2 rounded-full', style.line].join(' ')} />
          </div>
        </div>
      </div>
    </div>
  )
}
