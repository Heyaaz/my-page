import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: '저는 누구이고, 어떻게 일하며, 무엇에 관심 있는지 소개합니다.',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-2">About</h1>
      <p className="text-neutral-500 mb-12">개발자이자 빌더입니다.</p>

      <section className="space-y-10">
        <div>
          <h2 className="text-lg font-semibold mb-3">나는 누구인가</h2>
          <p className="text-neutral-600 leading-relaxed">
            소프트웨어를 만들고, 문제를 풀고, 그 과정을 기록합니다.
            코드로 아이디어를 현실로 만드는 일에 가장 많은 에너지를 씁니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">관심 분야</h2>
          <ul className="space-y-1 text-neutral-600">
            <li>— 프로덕트 개발 및 설계</li>
            <li>— 개발자 도구 및 생산성</li>
            <li>— AI/ML 응용</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">사용하는 기술</h2>
          <div className="flex flex-wrap gap-2">
            {['TypeScript', 'Next.js', 'React', 'Node.js', 'PostgreSQL', 'Python'].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">작업 방식</h2>
          <p className="text-neutral-600 leading-relaxed">
            먼저 구조를 파악하고, 작은 단위로 빠르게 검증하며, 작동하는 것을 먼저 만듭니다.
            완벽한 설계보다 반복 가능한 구조를 선호합니다.
          </p>
        </div>
      </section>
    </div>
  )
}
