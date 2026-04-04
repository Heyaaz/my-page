import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProjectBySlug } from '@/lib/supabase/queries'
import { createStaticClient } from '@/lib/supabase/static'
import { buildPostMetadata } from '@/lib/seo/metadata'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { getProjectTypeClassName, getProjectTypeLabel } from '@/lib/portfolio/project-type'

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

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-400">
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
      <p className="mb-8 text-lg text-neutral-500">{project.summary}</p>

      <div className="mb-10 flex flex-wrap gap-4">
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm text-white transition-colors hover:bg-neutral-700"
          >
            프로젝트 보기 →
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm text-neutral-700 transition-colors hover:border-neutral-600"
          >
            GitHub
          </a>
        )}
      </div>

      <div className="mb-12 grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-6 text-sm md:grid-cols-4">
        {project.role && (
          <div>
            <p className="mb-1 text-xs text-neutral-400">역할</p>
            <p className="font-medium">{project.role}</p>
          </div>
        )}
        {project.duration && (
          <div>
            <p className="mb-1 text-xs text-neutral-400">기간</p>
            <p className="font-medium">{project.duration}</p>
          </div>
        )}
        {stack.length > 0 && (
          <div className="col-span-2">
            <p className="mb-1 text-xs text-neutral-400">스택</p>
            <p className="font-medium">{stack.join(', ')}</p>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-100 pt-10">
        <MarkdownRenderer content={project.content} />
      </div>

      {project.outcome && (
        <div className="mt-10 rounded-r-xl border-l-4 border-neutral-900 bg-neutral-50 p-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-neutral-400">결과</p>
          <p className="leading-relaxed text-neutral-700">{project.outcome}</p>
        </div>
      )}
    </article>
  )
}
