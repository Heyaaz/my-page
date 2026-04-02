import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import AdminEditor from '@/components/admin/AdminEditor'
import AdminLoginForm from '@/components/admin/AdminLoginForm'
import AdminMfaGate from '@/components/admin/AdminMfaGate'
import AdminUnauthorized from '@/components/admin/AdminUnauthorized'
import { getSupabasePublicKey } from '@/lib/supabase/env'

export const metadata: Metadata = {
  title: 'Admin',
  description: '블로그와 포트폴리오 콘텐츠를 관리하는 관리자 페이지입니다.',
  robots: {
    index: false,
    follow: false,
  },
}

function getAdminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

export default async function AdminPage() {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!getSupabasePublicKey()

  if (!hasSupabase) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">
            Admin
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">관리자 로그인 설정 필요</h1>
          <p className="text-neutral-500 leading-relaxed">
            Supabase 환경 변수가 없어 관리자 페이지를 사용할 수 없습니다.
          </p>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 leading-relaxed">
          <p className="font-medium mb-2">필요한 환경 변수</p>
          <ul className="space-y-1 list-disc pl-5">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>ADMIN_EMAILS (허용할 관리자 이메일 목록)</li>
          </ul>
        </div>
      </div>
    )
  }

  const allowlist = getAdminAllowlist()
  const requireMfa = (process.env.ADMIN_REQUIRE_MFA ?? 'true').toLowerCase() !== 'false'

  if (allowlist.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">
            Admin
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">관리자 허용 목록 설정 필요</h1>
          <p className="text-neutral-500 leading-relaxed">
            운영 환경에서는 <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-[0.9em]">ADMIN_EMAILS</code> 없이 관리자 접근을 열지 않습니다.
          </p>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 leading-relaxed">
          <p className="font-medium mb-2">예시</p>
          <p><code>ADMIN_EMAILS=admin@example.com,owner@example.com</code></p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const email = user?.email?.toLowerCase() ?? null
  const isAuthorized = !!user && email !== null && allowlist.includes(email)

  let aal: 'aal1' | 'aal2' | null = null
  if (isAuthorized && requireMfa) {
    const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    aal = data?.currentLevel ?? null
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">

      {!user ? (
        <AdminLoginForm />
      ) : !isAuthorized ? (
        <AdminUnauthorized allowlistConfigured />
      ) : requireMfa && aal !== 'aal2' ? (
        <AdminMfaGate />
      ) : (
        <AdminEditor />
      )}
    </div>
  )
}
