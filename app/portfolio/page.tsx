import { Metadata } from 'next'
import { getAllProjects } from '@/lib/supabase/queries'
import ProjectCard from '@/components/portfolio/ProjectCard'

export const metadata: Metadata = {
  title: 'Portfolio',
  description: '만든 것들을 기록합니다.',
}

export default async function PortfolioPage() {
  const projects = await getAllProjects()

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Portfolio</h1>
      <p className="text-neutral-500 mb-12">만든 것들을 기록합니다.</p>

      {projects.length === 0 ? (
        <p className="text-neutral-400 text-sm">아직 등록된 프로젝트가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
