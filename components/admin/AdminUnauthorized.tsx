'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Props = {
  allowlistConfigured: boolean
}

export default function AdminUnauthorized({ allowlistConfigured }: Props) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function handleLogout() {
    setSubmitting(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-400 mb-3">Unauthorized</p>
      <h2 className="text-2xl font-bold tracking-tight text-red-950 mb-3">접근 권한이 없습니다</h2>
      <div className="space-y-2 text-sm text-red-800 leading-relaxed">
        {allowlistConfigured ? (
          <p>이 계정은 <code className="rounded bg-white px-1.5 py-0.5 text-[0.85em]">ADMIN_EMAILS</code> 허용 목록에 포함되어 있지 않습니다.</p>
        ) : (
          <p>인증은 되었지만 admin 접근 조건을 확인할 수 없습니다.</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={submitting}
        className="mt-6 inline-flex items-center rounded-full border border-red-300 px-5 py-2.5 text-sm font-medium text-red-900 transition-colors hover:border-red-500 disabled:opacity-50"
      >
        {submitting ? '로그아웃 중...' : '다른 계정으로 로그인'}
      </button>
    </div>
  )
}
