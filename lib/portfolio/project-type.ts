export const PROJECT_TYPE_OPTIONS = [
  { value: 'work', label: 'Work' },
  { value: 'side', label: 'Side Project' },
] as const

const PROJECT_TYPE_STYLE = {
  work: 'bg-slate-100 text-slate-700',
  side: 'bg-emerald-100 text-emerald-700',
} as const

export function normalizeProjectType(value: string | null | undefined) {
  if (value === 'work' || value === 'side') return value
  return null
}

export function getProjectTypeLabel(value: string | null | undefined) {
  const normalized = normalizeProjectType(value)
  if (!normalized) return null
  return normalized === 'work' ? 'Work' : 'Side Project'
}

export function getProjectTypeClassName(value: string | null | undefined) {
  const normalized = normalizeProjectType(value)
  if (!normalized) return 'bg-neutral-100 text-neutral-600'
  return PROJECT_TYPE_STYLE[normalized]
}
