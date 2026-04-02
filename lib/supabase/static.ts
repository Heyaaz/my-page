import { createClient } from '@supabase/supabase-js'

// generateStaticParams 등 빌드 타임 전용 — cookies() 없이 직접 연결
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
