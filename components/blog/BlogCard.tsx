import Link from 'next/link'
import { BlogPostSummary } from '@/types/blog'
import { formatDate } from '@/lib/utils/date'

export default function BlogCard({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          {post.category && <span>{post.category}</span>}
          {post.published_at && (
            <span>{formatDate(post.published_at)}</span>
          )}
          {post.reading_time && <span>{post.reading_time}분</span>}
        </div>
        <h2 className="text-lg font-semibold text-neutral-900 group-hover:underline leading-snug">
          {post.title}
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
      </article>
    </Link>
  )
}
