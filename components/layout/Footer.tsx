import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-neutral-400">
          © {new Date().getFullYear()} Heeyaa. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a
            href="mailto:your@email.com"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Email
          </a>
          <a
            href="https://github.com/yourgithub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
