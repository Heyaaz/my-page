import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProjects, getRecentPosts } from '@/lib/supabase/queries'
import { formatDate } from '@/lib/utils/date'
import { PortfolioProjectSummary } from '@/types/portfolio'
import { BlogPostSummary } from '@/types/blog'

export default async function HomePage() {
  const [projects, posts] = await Promise.all([
    getFeaturedProjects(3),
    getRecentPosts(3),
  ])

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="min-h-[90svh] flex flex-col justify-center max-w-5xl mx-auto px-6 pt-12 pb-24">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-8">
            Backend Developer
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05] text-neutral-950 mb-8"
            style={{ wordBreak: 'keep-all' }}
          >
            구조를 설계하고,<br />
            시스템을 만듭니다.
          </h1>
          <p
            className="text-lg md:text-xl text-neutral-500 leading-relaxed max-w-xl mb-12"
            style={{ wordBreak: 'keep-all' }}
          >
            백엔드 개발자 Heeyaa입니다. 복잡한 문제를 구조적으로 풀고,
            안정적으로 운영 가능한 서비스를 고민하고 구현합니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-neutral-950 text-white text-sm font-medium rounded-full hover:bg-neutral-700 transition-all duration-300"
            >
              포트폴리오 보기
              <ArrowRight />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-neutral-200 text-neutral-900 text-sm font-medium rounded-full hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-300"
            >
              블로그 보기
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Highlights */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-neutral-100">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Work
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              대표 프로젝트
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors hidden md:block"
          >
            전체 보기 →
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState label="준비 중인 프로젝트가 있습니다." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectHighlightCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <Link
          href="/portfolio"
          className="inline-block mt-8 text-sm text-neutral-400 hover:text-neutral-900 transition-colors md:hidden"
        >
          전체 보기 →
        </Link>
      </section>

      {/* Blog Highlights */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-neutral-100">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Writing
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
              최근 글
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors hidden md:block"
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
          className="inline-block mt-8 text-sm text-neutral-400 hover:text-neutral-900 transition-colors md:hidden"
        >
          전체 보기 →
        </Link>
      </section>

      {/* About Summary */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-4">
              About
            </p>
            <h2
              className="text-3xl font-bold tracking-tight text-neutral-950 mb-6 leading-snug"
              style={{ wordBreak: 'keep-all' }}
            >
              병목을 찾고,<br />
              구조를 개선합니다.
            </h2>
            <p
              className="text-neutral-500 leading-relaxed mb-6"
              style={{ wordBreak: 'keep-all' }}
            >
              실제 서비스에서 성능과 안정성 문제를 다루며,
              쿼리 구조 재설계와 N+1 해결, 구조 개선 같은 작업을 꾸준히 해왔습니다.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 hover:gap-3 transition-all duration-200"
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
              <div key={item.label} className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-400 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-neutral-800" style={{ wordBreak: 'keep-all' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 py-24 border-t border-neutral-100">
        <div className="bg-neutral-950 rounded-3xl px-10 py-16 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3 leading-snug"
              style={{ wordBreak: 'keep-all' }}
            >
              함께 해결할 문제가 있나요?
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed" style={{ wordBreak: 'keep-all' }}>
              복잡한 문제를 구조적으로 풀고, 더 빠르고 안정적인 서비스를 만드는 일에 기여하고 싶습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-950 text-sm font-medium rounded-full hover:bg-neutral-100 transition-all duration-300"
            >
              연락하기
              <ArrowRight />
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center px-6 py-3 border border-white/20 text-white text-sm font-medium rounded-full hover:border-white/50 transition-all duration-300"
            >
              작업물 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProjectHighlightCard({ project }: { project: PortfolioProjectSummary }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <article className="border border-neutral-100 rounded-2xl overflow-hidden hover:border-neutral-300 transition-all duration-300 h-full">
        {project.cover_image_url ? (
          <div className="relative aspect-video bg-neutral-50">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-video bg-neutral-50 flex items-center justify-center">
            <span className="text-3xl font-bold text-neutral-200 tracking-tighter">
              {project.title.slice(0, 2)}
            </span>
          </div>
        )}
        <div className="p-5">
          <h3 className="font-semibold text-neutral-900 mb-1.5 group-hover:underline leading-snug">
            {project.title}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-2 mb-3">{project.summary}</p>
          {project.stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 3).map((s) => (
                <span key={s} className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded-full">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

function BlogHighlightRow({ post }: { post: BlogPostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 group-hover:underline mb-1 leading-snug">
            {post.title}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-1">{post.excerpt}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-neutral-400 flex-shrink-0">
          {post.category && <span>{post.category}</span>}
          {post.published_at && (
            <span>{formatDate(post.published_at)}</span>
          )}
          {post.reading_time && <span>{post.reading_time}분</span>}
        </div>
      </div>
    </Link>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-12 text-center border border-dashed border-neutral-200 rounded-2xl">
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
