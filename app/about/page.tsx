import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: '구조적으로 문제를 파악하고 성능과 안정성을 개선하는 백엔드 개발자 HeeJae를 소개합니다.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-2">About</h1>
      <p className="text-neutral-500 mb-12">구조적으로 문제를 파악하고 성능과 안정성을 개선하는 개발자입니다.</p>

      <section className="space-y-12">
        <div>
          <h2 className="text-lg font-semibold mb-3">나는 누구인가</h2>
          <div className="space-y-4 text-neutral-600 leading-relaxed">
            <p>
              어제 배운 기술이 오늘 팀의 성과로 이어질 때 가장 큰 열정을 느끼는 개발자입니다.
              실제 서비스에서 병목과 구조적 문제를 찾고, 더 빠르고 안정적인 시스템으로 바꾸는 과정에 가장 많은 에너지를 씁니다.
            </p>
            <p>
              부족한 부분이 보이면 그게 제 담당이든 아니든 직접 메우는 편입니다.
              팀 안에서도 빈 곳이 보이면 먼저 움직이고, 제 역량에서 부족한 부분도 개인 프로젝트를 통해 직접 채워가고 있습니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">어떻게 문제를 해결하는가</h2>
          <div className="space-y-4 text-neutral-600 leading-relaxed">
            <p>
              문제가 생기면 바로 코드를 고치기보다 먼저 원인을 파악하고, 어디서부터 손대야 할지 순서를 정한 뒤에 작업합니다.
              병목 지점을 나누고 단계별로 검증하면서 개선하는 방식이 결국 더 빠르고 안정적인 결과를 만든다고 믿습니다.
            </p>
            <p>
              실제로 쿼리 구조 재설계, N+1 해결, 병렬 처리 적용, 서버사이드 검증 도입 같은 작업을 통해
              서비스 응답 시간을 크게 줄이고 안정성을 높이는 경험을 여러 번 해왔습니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">강점</h2>
          <ul className="space-y-2 text-neutral-600 leading-relaxed">
            <li>— 성능 병목을 구조적으로 찾아내고 개선하는 능력</li>
            <li>— 새로운 기술과 도구를 빠르게 익혀 실무 흐름에 연결하는 적응력</li>
            <li>— 기능 구현에서 멈추지 않고 사용자 관점에서 다시 설계를 점검하는 태도</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">관심 분야</h2>
          <ul className="space-y-2 text-neutral-600 leading-relaxed">
            <li>— 백엔드 시스템 설계와 성능 최적화</li>
            <li>— 프로덕트 개발과 서비스 문제 해결</li>
            <li>— AI를 활용한 워크플로우와 개발자 생산성 도구</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">사용하는 기술</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Java',
              'Spring Boot',
              'Node.js',
              'JavaScript',
              'TypeScript',
              'Next.js',
              'JPA',
              'QueryDSL',
              'Prisma',
              'PostgreSQL',
              'MySQL',
              'Redis',
              'Docker',
              'AWS',
              'Prometheus',
              'Grafana',
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </section>
    </div>
  )
}
