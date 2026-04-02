import type { BlogPostSummary } from '@/types/blog'

const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/

function stripMarkdown(content: string) {
  return content
    .replace(MARKDOWN_IMAGE_REGEX, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getBlogPreviewText(post: Pick<BlogPostSummary, 'excerpt' | 'content'>) {
  const excerpt = post.excerpt?.trim()
  if (excerpt) return excerpt

  const content = post.content?.trim()
  if (!content) return ''

  return stripMarkdown(content)
}

export function getBlogPreviewImage(post: Pick<BlogPostSummary, 'cover_image_url' | 'content'>) {
  if (post.cover_image_url) {
    return post.cover_image_url
  }

  const match = post.content?.match(MARKDOWN_IMAGE_REGEX)
  return match?.[1] ?? null
}
