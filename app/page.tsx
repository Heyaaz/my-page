import Link from 'next/link'
import { getFeaturedProjects, getRecentPosts } from '@/lib/supabase/queries'
import { formatDate } from '@/lib/utils/date'
import { getBlogCategoryStyle } from '@/lib/blog/categories'
import ProjectCard from '@/components/portfolio/ProjectCard'
import { BlogPostSummary } from '@/types/blog'

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getFeaturedProjects(6),
    getRecentPosts(3),
  ])

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="mx-auto flex min-h-[90svh] max-w-5xl flex-col justify-center px-6 pt-12 pb-24">
        <div className="max-w-3xl">
          <p className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
            Backend Developer
          </p>
          <h1
            className="mb-8 text-5xl font-bold leading-[1.05] tracking-tighter text-neutral-950 md:text-7xl"
            style={{ wordBreak: 'keep-all' }}
          >
            구조를 설계하고,<br />
            시스템을 만듭니다.
          </h1>
          <p
            className="mb-12 max-w-xl text-lg leading-relaxed text-neutral-500 md:text-xl"
            style={{ wordBreak: 'keep-all' }}
          >
            백엔드 개발자 HeeJae입니다. 복잡한 문제를 구조적으로 풀고,
            안정적으로 운영 가능한 서비스를 고민하고 구현합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-neutral-700"
            >
              포트폴리오 보기
              <ArrowRight />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-7 py-3.5 text-sm font-medium text-neutral-900 transition-all duration-300 hover:border-neutral-400 hover:bg-neutral-50"
            >
              블로그 보기
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Highlights */}
      <section className="mx-auto max-w-5xl border-t border-neutral-100 px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              Portfolio
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              대표 프로젝트
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="hidden text-sm text-neutral-400 transition-colors hover:text-neutral-900 md:block"
          >
            전체 보기 →
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState label="준비 중인 프로젝트가 있습니다." />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <Link
          href="/portfolio"
          className="mt-8 inline-block text-sm text-neutral-400 transition-colors hover:text-neutral-900 md:hidden"
        >
          전체 보기 →
        </Link>
      </section>

      {/* Blog Highlights */}
      <section className="mx-auto max-w-5xl border-t border-neutral-100 px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              Writing
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              최근 글
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden text-sm text-neutral-400 transition-colors hover:text-neutral-900 md:block"
          >
            전체 보기 →
          </Link>
        </div>

        {posts.length === 0 ? (
          <EmptyState label="첫 번째 글을 준비 중입니다." />
        ) : (
          <div className="divide-y divide-neutral-100">
            {posts.map((post) => (
              <BlogHighlightRow key={post.id} post={post} />
            ))}
          </div>
        )}

        <Link
          href="/blog"
          className="mt-8 inline-block text-sm text-neutral-400 transition-colors hover:text-neutral-900 md:hidden"
        >
          전체 보기 →
        </Link>
      </section>

      {/* About Summary */}
      <section className="mx-auto max-w-5xl border-t border-neutral-100 px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
              About
            </p>
            <h2
              className="mb-6 text-3xl font-bold leading-snug tracking-tight text-neutral-950"
              style={{ wordBreak: 'keep-all' }}
            >
              병목을 찾고,<br />
              구조를 개선합니다.
            </h2>
            <p
              className="mb-6 leading-relaxed text-neutral-500"
              style={{ wordBreak: 'keep-all' }}
            >
              실제 서비스에서 성능과 안정성 문제를 다루며,
              쿼리 구조 재설계와 N+1 해결, 구조 개선 같은 작업을 꾸준히 해왔습니다.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 transition-all duration-200 hover:gap-3"
            >
              더 알아보기
              <ArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '관심 분야', value: '백엔드 시스템 · 프로덕트' },
              { label: '주력 스택', value: 'Java · Spring · TypeScript' },
              { label: '강점', value: '성능 최적화 · 구조 개선' },
              { label: '현재 관심사', value: 'AI 활용 워크플로우 · 개발 생산성' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-neutral-50 p-4">
                <p className="mb-1 text-xs text-neutral-400">{item.label}</p>
                <p className="text-sm font-medium text-neutral-800" style={{ wordBreak: 'keep-all' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl border-t border-neutral-100 px-6 py-24">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-neutral-950 px-10 py-16 md:flex-row md:items-center md:px-16">
          <div>
            <h2
              className="mb-3 text-2xl font-bold leading-snug tracking-tight text-white md:text-3xl"
              style={{ wordBreak: 'keep-all' }}
            >
              함께 해결할 문제가 있나요?
            </h2>
            <p className="text-sm leading-relaxed text-neutral-400" style={{ wordBreak: 'keep-all' }}>
              복잡한 문제를 구조적으로 풀고, 더 빠르고 안정적인 서비스를 만드는 일에 기여하고 싶습니다.
            </p>
          </div>
          <div className="flex flex-shrink-0 flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition-all duration-300 hover:bg-neutral-100"
            >
              연락하기
              <ArrowRight />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/50"
            >
              작업물 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function BlogHighlightRow({ post }: { post: BlogPostSummary }) {
  const categoryStyle = getBlogCategoryStyle(post.category)

  return (
    <Link href={`/blog/${post.slug}`} className="group block py-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 font-semibold leading-snug text-neutral-900 group-hover:underline">
            {post.title}
          </h3>
          <p className="line-clamp-1 text-sm text-neutral-500">{post.excerpt}</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-4 text-xs text-neutral-400">
          {post.category && <span className={['font-medium', categoryStyle.text].join(' ')}>{post.category}</span>}
          {post.published_at && <span>{formatDate(post.published_at)}</span>}
          {post.reading_time && <span>{post.reading_time}분</span>}
        </div>
      </div>
    </Link>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 py-12 text-center">
      <p className="text-sm text-neutral-400">{label}</p>
    </div>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  )
}
