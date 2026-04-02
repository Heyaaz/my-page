import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: '이메일과 GitHub 링크로 연락할 수 있습니다.',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-12">Contact</h1>

      <div className="space-y-6">
        <a
          href="mailto:pion0458@gmail.com"
          className="flex items-center gap-4 p-5 border border-neutral-200 rounded-xl hover:border-neutral-400 transition-colors group"
        >
          <span className="text-2xl">✉️</span>
          <div>
            <p className="font-medium text-neutral-900 group-hover:underline">Email</p>
            <p className="text-sm text-neutral-500">pion0458@gmail.com</p>
          </div>
        </a>

        <a
          href="https://github.com/Heyaaz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-5 border border-neutral-200 rounded-xl hover:border-neutral-400 transition-colors group"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.589 2 12.248c0 4.526 2.865 8.365 6.839 9.72.5.095.682-.222.682-.493 0-.243-.008-.888-.013-1.742-2.782.62-3.369-1.37-3.369-1.37-.455-1.177-1.11-1.49-1.11-1.49-.908-.637.069-.624.069-.624 1.004.072 1.532 1.055 1.532 1.055.892 1.56 2.341 1.11 2.91.849.091-.664.349-1.11.635-1.366-2.22-.26-4.555-1.137-4.555-5.06 0-1.118.39-2.033 1.03-2.75-.103-.261-.447-1.31.098-2.73 0 0 .84-.276 2.75 1.05A9.298 9.298 0 0 1 12 6.836c.85.004 1.705.118 2.504.346 1.909-1.326 2.748-1.05 2.748-1.05.547 1.42.203 2.469.1 2.73.64.717 1.028 1.632 1.028 2.75 0 3.933-2.339 4.797-4.566 5.052.359.318.679.944.679 1.902 0 1.374-.012 2.482-.012 2.82 0 .273.18.592.688.492C19.138 20.61 22 16.772 22 12.248 22 6.589 17.523 2 12 2Z"/>
            </svg>
          </span>
          <div>
            <p className="font-medium text-neutral-900 group-hover:underline">GitHub</p>
            <p className="text-sm text-neutral-500">github.com/Heyaaz</p>
          </div>
        </a>
      </div>


    </div>
  )
}
