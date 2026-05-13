export type MarkdownHeading = {
  id: string
  text: string
  level: 1 | 2 | 3
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/\\([\\`*_[\]{}()#+\-.!>])/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export function createHeadingId(text: string) {
  const normalized = text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return normalized || 'section'
}

function getUniqueHeadingId(text: string, seen: Map<string, number>) {
  const baseId = createHeadingId(text)
  const count = seen.get(baseId) ?? 0
  seen.set(baseId, count + 1)

  return count === 0 ? baseId : `${baseId}-${count + 1}`
}

export function extractMarkdownHeadings(content: string): MarkdownHeading[] {
  const headings: MarkdownHeading[] = []
  const seen = new Map<string, number>()
  let isInFence = false

  for (const line of content.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      isInFence = !isInFence
      continue
    }

    if (isInFence) continue

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!match) continue

    const text = stripInlineMarkdown(match[2])
    if (!text) continue

    headings.push({
      id: getUniqueHeadingId(text, seen),
      text,
      level: match[1].length as 1 | 2 | 3,
    })
  }

  return headings
}
