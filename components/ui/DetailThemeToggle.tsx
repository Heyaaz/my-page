'use client'

import type { RefObject } from 'react'

type Props = {
  scopeRef: RefObject<HTMLDivElement | null>
}

const STORAGE_KEY = 'detail-page-theme'

function resolveStoredTheme(value: string | null) {
  return value === 'dark' ? 'dark' : 'light'
}

export default function DetailThemeToggle({ scopeRef }: Props) {
  function handleToggle() {
    const scope = scopeRef.current
    if (!scope) return

    const currentTheme = resolveStoredTheme(scope.dataset.detailTheme ?? null)
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'

    scope.dataset.detailTheme = nextTheme
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center rounded-full border border-[color:var(--detail-panel-border)] bg-[color:var(--detail-panel-bg)] px-4 py-2 text-sm font-medium text-[color:var(--detail-panel-foreground)] shadow-sm transition-colors duration-300 hover:bg-[color:var(--detail-soft-bg)]"
      aria-label="상세 페이지 테마 전환"
    >
      테마 전환
    </button>
  )
}
