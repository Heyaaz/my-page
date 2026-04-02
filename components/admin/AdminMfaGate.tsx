'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { inputCls } from './admin-styles'

type TotpFactor = {
  id: string
  factor_type: 'totp'
  status: 'verified' | 'unverified'
  friendly_name?: string
}

type EnrollmentState = {
  factorId: string
  qrCode: string
  secret: string
  uri: string
} | null

type TotpEnrollment = {
  id: string
  type: 'totp'
  friendly_name?: string
  totp: {
    qr_code: string
    secret: string
    uri: string
  }
}

export default function AdminMfaGate() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [verifiedFactor, setVerifiedFactor] = useState<TotpFactor | null>(null)
  const [enrollment, setEnrollment] = useState<EnrollmentState>(null)

  useEffect(() => {
    let active = true

    async function loadMfaState() {
      const [{ data: aalData }, { data: factorData, error: factorError }] = await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors(),
      ])

      if (!active) return

      if (aalData?.currentLevel === 'aal2') {
        router.refresh()
        return
      }

      if (factorError) {
        setError('2단계 인증 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
        setLoading(false)
        return
      }

      const existingFactor = (factorData?.totp?.[0] ?? null) as TotpFactor | null
      setVerifiedFactor(existingFactor)
      setLoading(false)
    }

    void loadMfaState()

    return () => {
      active = false
    }
  }, [router, supabase])

  async function handleEnroll() {
    setVerifying(true)
    setError(null)

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Admin access',
    })

    setVerifying(false)

    const enrolled = data as TotpEnrollment | null

    if (error || !enrolled || enrolled.type !== 'totp') {
      setError('2단계 인증 등록을 시작하지 못했습니다. Supabase Auth의 MFA 설정을 확인해주세요.')
      return
    }

    setEnrollment({
      factorId: enrolled.id,
      qrCode: enrolled.totp.qr_code,
      secret: enrolled.totp.secret,
      uri: enrolled.totp.uri,
    })
    setVerifiedFactor(null)
  }

  async function handleVerify() {
    const factorId = verifiedFactor?.id ?? enrollment?.factorId
    if (!factorId || !code.trim()) return

    setVerifying(true)
    setError(null)

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    })

    setVerifying(false)

    if (error) {
      setError('2단계 인증 코드 확인에 실패했습니다. 코드를 다시 확인해주세요.')
      return
    }

    router.refresh()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px]">
      <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">
          MFA
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-950 mb-3">
          관리자 2단계 인증
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed mb-8 max-w-2xl">
          관리자 페이지에 들어오려면 2단계 인증(TOTP)이 필요합니다. 이미 인증 앱이 연결되어 있다면 코드를 입력하고,
          아직 없다면 아래에서 등록을 시작하세요.
        </p>

        {loading ? (
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-10 text-sm text-neutral-400">
            2단계 인증 상태를 확인하는 중...
          </div>
        ) : (
          <div className="space-y-6">
            {verifiedFactor ? (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
                <p className="font-medium text-neutral-900 mb-1">등록된 인증기 발견</p>
                <p>{verifiedFactor.friendly_name ?? 'Admin access'} 계정의 코드를 입력하세요.</p>
              </div>
            ) : enrollment ? (
              <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
                <div>
                  <p className="font-medium text-neutral-900 mb-2">인증 앱 등록</p>
                  <p className="leading-relaxed">
                    아래 QR을 스캔하거나 secret을 복사해 인증 앱에 추가한 뒤, 생성된 6자리 코드를 입력하세요.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-neutral-200 inline-block">
                  <Image src={enrollment.qrCode} alt="Admin TOTP QR" width={160} height={160} unoptimized className="h-40 w-40" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-2">Secret</p>
                  <code className="block rounded-xl bg-white border border-neutral-200 px-3 py-2 break-all text-[13px] text-neutral-700">
                    {enrollment.secret}
                  </code>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-700">
                <p className="font-medium text-neutral-900 mb-2">등록된 TOTP가 없습니다</p>
                <p className="leading-relaxed mb-4">
                  관리자 접근용 2단계 인증을 먼저 등록해야 합니다.
                </p>
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={verifying}
                  className="inline-flex items-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                >
                  {verifying ? '등록 준비 중...' : '2단계 인증 등록 시작'}
                </button>
              </div>
            )}

            {(verifiedFactor || enrollment) && (
              <div className="max-w-md space-y-4">
                <div>
                  <label htmlFor="mfa-code" className="block text-xs font-medium text-neutral-500 mb-1">
                    6자리 인증 코드
                  </label>
                  <input
                    id="mfa-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className={inputCls}
                  />
                </div>

                {error && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={verifying || code.length !== 6}
                  className="inline-flex min-w-40 items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                >
                  {verifying ? '인증 중...' : '코드 확인'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 mb-3">
          Security Notes
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-neutral-950 mb-4">
          관리자 페이지 보안 메모
        </h3>
        <ul className="space-y-3 text-sm text-neutral-600 leading-relaxed">
          <li>• 2단계 인증은 admin 접근 시점에 AAL2를 요구합니다.</li>
          <li>• 운영에서는 RLS 정책으로 일반 사용자의 write/delete를 반드시 막아야 합니다.</li>
          <li>• 동일 브라우저 세션에서도 MFA가 풀리면 admin editor는 다시 차단됩니다.</li>
        </ul>
      </div>
    </div>
  )
}

