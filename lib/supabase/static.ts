import { createClient } from '@supabase/supabase-js'
import { getSupabasePublicKey, getSupabaseUrl } from './env'

// generateStaticParams 등 빌드 타임 전용 — cookies() 없이 직접 연결
export function createStaticClient() {
  return createClient(getSupabaseUrl(), getSupabasePublicKey())
}
