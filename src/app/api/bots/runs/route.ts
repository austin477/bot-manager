import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { BotStatus } from '@/types'

const VALID_STATUSES: BotStatus[] = ['queued', 'running', 'completed', 'failed']

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const status  = searchParams.get('status')
  const limitRaw = searchParams.get('limit')
  const limit   = limitRaw ? Math.min(parseInt(limitRaw, 10) || 50, 200) : 50

  const supabase = createServerClient()
  let query = supabase
    .from('bot_runs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status && VALID_STATUSES.includes(status as BotStatus)) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[runs] Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
