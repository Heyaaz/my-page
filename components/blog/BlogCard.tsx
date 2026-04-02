import Link from 'next/link'
import Image from 'next/image'
import { BlogPostSummary } from '@/types/blog'
import { formatDate } from '@/lib/utils/date'
import { getBlogPreviewImage, getBlogPreviewText } from '@/lib/blog/preview'
import { getBlogCategoryStyle } from '@/lib/blog/categories'

const DEFAULT_BLOG_THUMBNAIL = '/blog-default-thumb.svg'

export default function BlogCard({ post }: { post: BlogPostSummary }) {
  const previewImage = getBlogPreviewImage(post) ?? DEFAULT_BLOG_THUMBNAIL
  const previewText = getBlogPreviewText(post)
  const categoryStyle = getBlogCategoryStyle(post.category)

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="relative aspect-[16/10] bg-neutral-50">
          <Image
            src={previewImage}
            alt={post.title}
            fill
            className="object-cover"
            loading="lazy"
          />
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
            {previewText || '요약이 비어 있는 글은 본문 앞부분을 자동으로 가져와 미리보기로 사용합니다.'}
          </p>

          <div className="mt-6 text-sm font-medium text-neutral-900">
            자세히 보기 →
          </div>
        </div>
      </article>
    </Link>
  )
}
