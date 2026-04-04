import Link from 'next/link'
import Image from 'next/image'
import { PortfolioProjectSummary } from '@/types/portfolio'
import { getProjectTypeClassName, getProjectTypeLabel } from '@/lib/portfolio/project-type'

export default function ProjectCard({ project }: { project: PortfolioProjectSummary }) {
  const stack = Array.isArray(project.stack) ? project.stack : []
  const projectTypeLabel = getProjectTypeLabel(project.status)
  const projectTypeClassName = getProjectTypeClassName(project.status)

  return (
    <Link href={`/portfolio/${project.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
        {project.cover_image_url && (
          <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-50">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col">
          {projectTypeLabel && (
            <div className="mb-3">
              <span className={[
                'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
                projectTypeClassName,
              ].join(' ')}>
                {projectTypeLabel}
              </span>
            </div>
          )}
          <h2 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900 group-hover:underline">
            {project.title}
          </h2>
          <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-neutral-500">{project.summary}</p>

          {(project.duration || project.outcome) && (
            <div className="mb-5 space-y-3 border-t border-b border-neutral-100 py-4">
              {project.duration && (
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-neutral-500">
                    기간
                  </span>
                  <span className="font-medium text-neutral-700">{project.duration}</span>
                </div>
              )}
              {project.outcome && (
                <div className="flex items-start gap-3 text-sm leading-relaxed text-neutral-600">
                  <span className="mt-0.5 inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-neutral-500">
                    성과
                  </span>
                  <p className="line-clamp-2 flex-1 text-neutral-600">{project.outcome}</p>
                </div>
              )}
            </div>
          )}

          {stack.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2">
              {stack.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600"
                >
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
