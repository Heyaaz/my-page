'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { inputCls } from './admin-styles'

export default function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setSubmitting(false)

    if (error) {
      setError('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.')
      return
    }

    router.refresh()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">
          Admin Login
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-950 mb-3">
          관리자 로그인
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed mb-8 max-w-lg">
          Supabase Auth에 등록된 이메일/비밀번호로 로그인해야 admin 작성 화면에 접근할 수 있습니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-neutral-500 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              className={inputCls}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-neutral-500 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호"
              className={inputCls}
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-w-40 items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {submitting ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">
          Notes
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-neutral-950 mb-4">
          로그인 전에 확인할 것
        </h3>
        <ul className="space-y-3 text-sm text-neutral-600 leading-relaxed">
          <li>• Supabase Auth에 admin 계정이 생성되어 있어야 합니다.</li>
          <li>• 운영 시에는 <code className="rounded bg-white px-1.5 py-0.5 text-[0.85em]">ADMIN_EMAILS</code>로 허용 이메일을 제한하는 것이 좋습니다.</li>
          <li>• 실제 데이터 보호는 앱 UI뿐 아니라 Supabase RLS 정책까지 함께 잡아야 안전합니다.</li>
        </ul>
      </div>
    </div>
  )
}

