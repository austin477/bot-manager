import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { BotRun, BotTemplate } from '@/types'

type DB = {
  public: {
    Tables: {
      bot_runs: { Row: BotRun; Insert: Omit<BotRun, 'id' | 'created_at' | 'updated_at'>; Update: Partial<BotRun> }
      bot_templates: { Row: BotTemplate; Insert: Omit<BotTemplate, 'id' | 'created_at'>; Update: Partial<BotTemplate> }
    }
  }
}

// Lazy singleton — safe during Next.js build when env vars aren't set
let _browser: SupabaseClient<DB> | null = null

export function getBrowserClient(): SupabaseClient<DB> {
  if (_browser) return _browser
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars are not set')
  _browser = createClient<DB>(url, key)
  return _browser
}

// Convenience re-export used in Dashboard (only runs in browser/server at request time)
export const supabase = new Proxy({} as SupabaseClient<DB>, {
  get(_target, prop) {
    return (getBrowserClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// Server-side client (service role — never expose to browser)
export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase server env vars are not set')
  return createClient(url, key)
}
