'use client'

import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components: Components = {
  a: (props) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
    />
  ),
}

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null
  return (
    <div className="prose max-w-none
      [--tw-prose-body:var(--prose-body)] [--tw-prose-headings:var(--prose-headings)]
      [--tw-prose-links:var(--prose-links)] [--tw-prose-bold:var(--prose-bold)]
      [--tw-prose-bullets:var(--detail-muted)] [--tw-prose-counters:var(--detail-muted)]
      [--tw-prose-quotes:var(--prose-quotes)] [--tw-prose-quote-borders:var(--prose-quote-borders)]
      [--tw-prose-captions:var(--detail-muted)] [--tw-prose-code:var(--prose-code)]
      [--tw-prose-pre-code:var(--prose-headings)] [--tw-prose-pre-bg:var(--prose-pre-bg)]
      [--tw-prose-hr:var(--prose-hr)]
      prose-headings:font-semibold prose-headings:tracking-tight
      prose-p:leading-7 prose-a:underline-offset-2
      prose-blockquote:border-l-2 prose-blockquote:not-italic
      prose-code:rounded prose-code:bg-[color:var(--prose-code-bg)] prose-code:px-1.5
      prose-code:py-0.5 prose-code:text-[0.85em]
      prose-code:before:content-none prose-code:after:content-none
      prose-pre:rounded-xl prose-pre:border prose-pre:border-[color:var(--prose-pre-border)]
      prose-img:rounded-xl prose-li:text-[color:var(--prose-body)]
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>
    </div>
  )
}
