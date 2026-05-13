'use client'

import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createHeadingId } from '@/lib/markdown/headings'

function getNodeText(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if (!node || typeof node !== 'object') return ''

  const maybeNode = node as { props?: { children?: unknown } }
  return getNodeText(maybeNode.props?.children)
}

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null

  const seenHeadingIds = new Map<string, number>()
  const getHeadingId = (children: unknown) => {
    const baseId = createHeadingId(getNodeText(children))
    const count = seenHeadingIds.get(baseId) ?? 0
    seenHeadingIds.set(baseId, count + 1)

    return count === 0 ? baseId : `${baseId}-${count + 1}`
  }

  const components: Components = {
    a: (props) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
      />
    ),
    h1: ({ children, node, ...props }) => {
      void node
      return (
        <h1 id={getHeadingId(children)} className="scroll-mt-24" {...props}>
          {children}
        </h1>
      )
    },
    h2: ({ children, node, ...props }) => {
      void node
      return (
        <h2 id={getHeadingId(children)} className="scroll-mt-24" {...props}>
          {children}
        </h2>
      )
    },
    h3: ({ children, node, ...props }) => {
      void node
      return (
        <h3 id={getHeadingId(children)} className="scroll-mt-24" {...props}>
          {children}
        </h3>
      )
    },
  }

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
