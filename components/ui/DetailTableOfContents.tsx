import type { MarkdownHeading } from '@/lib/markdown/headings'

type Props = {
  headings: MarkdownHeading[]
}

export default function DetailTableOfContents({ headings }: Props) {
  if (headings.length === 0) return null

  return (
    <aside className="hidden xl:block">
      <nav
        aria-label="본문 목차"
        className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-20 text-sm"
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--detail-muted)]">
          Contents
        </p>
        <ol className="space-y-2 border-l border-[color:var(--detail-divider)]">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={[
                  'block py-1 text-[color:var(--detail-muted)] transition-colors duration-200 hover:text-[color:var(--detail-panel-foreground)]',
                  heading.level === 1 ? 'pl-4 font-medium' : '',
                  heading.level === 2 ? 'pl-7' : '',
                  heading.level === 3 ? 'pl-10 text-xs' : '',
                ].join(' ')}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}
