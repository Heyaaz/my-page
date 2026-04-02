import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProjectBySlug } from '@/lib/supabase/queries'
import { createStaticClient } from '@/lib/supabase/static'
import { buildPostMetadata } from '@/lib/seo/metadata'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'

type Props = { params: Promise<{ slug: string }> }

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
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return buildPostMetadata(project.title, project.summary, project.cover_image_url ?? undefined)
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <article className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
        Case Study
      </p>
      <h1 className="text-3xl font-bold tracking-tight mb-4">{project.title}</h1>
      <p className="text-lg text-neutral-500 mb-8">{project.summary}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 bg-neutral-50 rounded-xl text-sm">
        {project.role && (
          <div>
            <p className="text-xs text-neutral-400 mb-1">역할</p>
            <p className="font-medium">{project.role}</p>
          </div>
        )}
        {project.duration && (
          <div>
            <p className="text-xs text-neutral-400 mb-1">기간</p>
            <p className="font-medium">{project.duration}</p>
          </div>
        )}
        {project.stack.length > 0 && (
          <div className="col-span-2">
            <p className="text-xs text-neutral-400 mb-1">스택</p>
            <p className="font-medium">{project.stack.join(', ')}</p>
          </div>
        )}
      </div>

      <div className="border-t border-neutral-100 pt-10">
        <MarkdownRenderer content={project.content} />
      </div>

      {project.outcome && (
        <div className="mt-10 p-6 border-l-4 border-neutral-900 bg-neutral-50 rounded-r-xl">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2">결과</p>
          <p className="text-neutral-700 leading-relaxed">{project.outcome}</p>
        </div>
      )}

      <div className="flex gap-4 flex-wrap mt-10">
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-neutral-900 text-white text-sm rounded-full hover:bg-neutral-700 transition-colors"
          >
            프로젝트 보기 →
          </a>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-neutral-300 text-neutral-700 text-sm rounded-full hover:border-neutral-600 transition-colors"
          >
            GitHub
          </a>
        )}
      </div>
    </article>
  )
}
