'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import DetailThemeToggle from '@/components/ui/DetailThemeToggle'

type Props = {
  children: ReactNode
  mobileMaxWidthClass: 'max-w-2xl' | 'max-w-3xl'
}

const STORAGE_KEY = 'detail-page-theme'

function resolveStoredTheme(value: string | null) {
  return value === 'dark' ? 'dark' : 'light'
}

export default function DetailThemeScope({ children, mobileMaxWidthClass }: Props) {
  const scopeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    scope.dataset.detailTheme = resolveStoredTheme(window.localStorage.getItem(STORAGE_KEY))
  }, [])

  return (
    <div ref={scopeRef} className="detail-theme-scope relative bg-[color:var(--detail-panel-bg)] transition-colors duration-300" data-detail-theme="light">
      <div className="pointer-events-none absolute inset-x-0 top-6 z-10 hidden md:block">
        <div className="mx-auto flex max-w-5xl justify-center px-6 lg:justify-end lg:pr-80 xl:pr-96">
          <div className="pointer-events-auto">
            <DetailThemeToggle scopeRef={scopeRef} />
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 md:hidden">
        <div className={`mx-auto flex ${mobileMaxWidthClass} justify-end`}>
          <DetailThemeToggle scopeRef={scopeRef} />
        </div>
      </div>

      {children}
    </div>
  )
}
