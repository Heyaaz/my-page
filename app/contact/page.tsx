import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: '협업 문의, 피드백, 혹은 그냥 안녕이라도 환영합니다.',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Contact</h1>
      <p className="text-neutral-500 mb-12">
        협업 문의, 피드백, 혹은 그냥 안녕이라도 환영합니다.
      </p>

      <div className="space-y-6">
        <a
          href="mailto:your@email.com"
          className="flex items-center gap-4 p-5 border border-neutral-200 rounded-xl hover:border-neutral-400 transition-colors group"
        >
          <span className="text-2xl">✉️</span>
          <div>
            <p className="font-medium text-neutral-900 group-hover:underline">Email</p>
            <p className="text-sm text-neutral-500">your@email.com</p>
          </div>
        </a>

        <a
          href="https://github.com/yourgithub"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 border border-neutral-200 rounded-xl hover:border-neutral-400 transition-colors group"
        >
          <span className="text-2xl">🐙</span>
          <div>
            <p className="font-medium text-neutral-900 group-hover:underline">GitHub</p>
            <p className="text-sm text-neutral-500">github.com/yourgithub</p>
          </div>
        </a>
      </div>

      <div className="mt-12 p-6 bg-neutral-50 rounded-xl">
        <p className="text-sm text-neutral-600 leading-relaxed">
          <strong className="text-neutral-900">협업 가능 분야:</strong> 프로덕트 개발, 기술 자문,
          사이드 프로젝트, 오픈소스 기여. 재미있는 아이디어라면 언제든 연락 주세요.
        </p>
      </div>
    </div>
  )
}
