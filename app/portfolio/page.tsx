import { Metadata } from 'next'
import { getAllProjects } from '@/lib/supabase/queries'
import ProjectCard from '@/components/portfolio/ProjectCard'
import { normalizeProjectType } from '@/lib/portfolio/project-type'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: '만든 것들을 기록합니다.',
}

export default async function PortfolioPage() {
  const projects = await getAllProjects()

  const workProjects = projects.filter((project) => normalizeProjectType(project.status) === 'work')
  const sideProjects = projects.filter((project) => normalizeProjectType(project.status) === 'side')
  const uncategorizedProjects = projects.filter((project) => normalizeProjectType(project.status) === null)

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Portfolio</h1>
      <p className="mb-12 text-neutral-500">만든 것들을 기록합니다.</p>

      {projects.length === 0 ? (
        <p className="text-sm text-neutral-400">아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <div className="space-y-16">
          <PortfolioSection
            title="Work"
            projects={workProjects}
          />
          <PortfolioSection
            title="Side Project"
            projects={sideProjects}
          />
          {uncategorizedProjects.length > 0 && (
            <PortfolioSection
              title="Other Projects"
              projects={uncategorizedProjects}
            />
          )}
        </div>
      )}
    </div>
  )
}

function PortfolioSection({
  title,
  projects,
}: {
  title: string
  projects: Awaited<ReturnType<typeof getAllProjects>>
}) {
  if (projects.length === 0) return null

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
