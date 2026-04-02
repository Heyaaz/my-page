'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null
  return (
    <div className="prose prose-neutral max-w-none
      prose-headings:font-semibold prose-headings:tracking-tight
      prose-p:text-neutral-700 prose-p:leading-7
      prose-a:text-neutral-900 prose-a:underline-offset-2
      prose-blockquote:border-l-2 prose-blockquote:border-neutral-300
        prose-blockquote:text-neutral-500 prose-blockquote:not-italic
      prose-code:bg-neutral-100 prose-code:text-neutral-800 prose-code:px-1.5
        prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em]
        prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-neutral-50 prose-pre:border prose-pre:border-neutral-200 prose-pre:rounded-xl
      prose-img:rounded-xl prose-hr:border-neutral-100
      prose-li:text-neutral-700
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
