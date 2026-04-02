import Link from 'next/link'
import Image from 'next/image'
import { PortfolioProjectSummary } from '@/types/portfolio'

export default function ProjectCard({ project }: { project: PortfolioProjectSummary }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <article className="border border-neutral-100 rounded-2xl overflow-hidden hover:border-neutral-300 transition-colors">
        {project.cover_image_url && (
          <div className="relative aspect-video bg-neutral-50">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-5">
          <h2 className="font-semibold text-neutral-900 mb-1 group-hover:underline">
            {project.title}
          </h2>
          <p className="text-sm text-neutral-500 mb-3 line-clamp-2">{project.summary}</p>
          {project.stack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full"
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
