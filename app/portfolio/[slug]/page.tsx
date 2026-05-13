import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProjectBySlug } from '@/lib/supabase/queries'
import { createStaticClient } from '@/lib/supabase/static'
import { buildPostMetadata } from '@/lib/seo/metadata'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { getProjectTypeClassName, getProjectTypeLabel } from '@/lib/portfolio/project-type'
import DetailThemeScope from '@/components/ui/DetailThemeScope'
import DetailTableOfContents from '@/components/ui/DetailTableOfContents'
import { extractMarkdownHeadings } from '@/lib/markdown/headings'

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
    .from('portfolio_projects')
    .select('slug')
    .eq('is_published', true)
  return (data ?? []).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const normalizedSlug = normalizeSlug(slug)
  const project = await getProjectBySlug(normalizedSlug)
  if (!project) return {}
  return buildPostMetadata(project.title, project.summary, project.cover_image_url ?? undefined)
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const normalizedSlug = normalizeSlug(slug)
  const project = await getProjectBySlug(normalizedSlug)
  if (!project) notFound()

  const stack = Array.isArray(project.stack) ? project.stack : []
  const projectTypeLabel = getProjectTypeLabel(project.status)
  const projectTypeClassName = getProjectTypeClassName(project.status)
  const headings = extractMarkdownHeadings(project.content)

  return (
    <DetailThemeScope mobileMaxWidthClass="max-w-3xl">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 xl:grid-cols-[minmax(0,48rem)_16rem] xl:justify-center">
        <article className="mx-auto w-full max-w-3xl py-20 text-[color:var(--detail-panel-foreground)] transition-colors duration-300">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[color:var(--detail-muted)] transition-colors duration-300">
            Project
          </p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight">{project.title}</h1>
          {projectTypeLabel && (
            <div className="mb-6">
              <span className={[
                'inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
                projectTypeClassName,
              ].join(' ')}>
                {projectTypeLabel}
              </span>
            </div>
          )}
          <p className="mb-8 text-lg text-[color:var(--detail-soft-foreground)] transition-colors duration-300">{project.summary}</p>

          <div className="mb-10 flex flex-wrap gap-4">
            {project.project_url && (
              <a
                href={project.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[color:var(--shell-primary)] px-5 py-2.5 text-sm text-[color:var(--shell-primary-foreground)] transition-colors duration-300 hover:opacity-85"
              >
                프로젝트 보기 →
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[color:var(--detail-panel-border)] px-5 py-2.5 text-sm text-[color:var(--detail-soft-foreground)] transition-colors duration-300 hover:border-[color:var(--detail-highlight-border)] hover:bg-[color:var(--detail-soft-bg)]"
              >
                GitHub
              </a>
            )}
          </div>

          <div className="mb-12 grid grid-cols-2 gap-4 rounded-xl bg-[color:var(--detail-soft-bg)] p-6 text-sm text-[color:var(--detail-soft-foreground)] transition-colors duration-300 md:grid-cols-4">
            {project.role && (
              <div>
                <p className="mb-1 text-xs text-[color:var(--detail-muted)]">역할</p>
                <p className="font-medium">{project.role}</p>
              </div>
            )}
            {project.duration && (
              <div>
                <p className="mb-1 text-xs text-[color:var(--detail-muted)]">기간</p>
                <p className="font-medium">{project.duration}</p>
              </div>
            )}
            {stack.length > 0 && (
              <div className="col-span-2">
                <p className="mb-1 text-xs text-[color:var(--detail-muted)]">스택</p>
                <p className="font-medium">{stack.join(', ')}</p>
              </div>
            )}
          </div>

          <div className="border-t border-[color:var(--detail-divider)] pt-10 transition-colors duration-300">
            <MarkdownRenderer content={project.content} />
          </div>

          {project.outcome && (
            <div className="mt-10 rounded-r-xl border-l-4 border-[color:var(--shell-primary)] bg-[color:var(--detail-soft-bg)] p-6 transition-colors duration-300">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[color:var(--detail-muted)]">결과</p>
              <p className="leading-relaxed text-[color:var(--detail-soft-foreground)]">{project.outcome}</p>
            </div>
          )}
        </article>
        <DetailTableOfContents headings={headings} />
      </div>
    </DetailThemeScope>
  )
}
