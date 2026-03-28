import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import type { ModelId } from '@/types'
import { MODEL_OPTIONS } from '@/types'

const VALID_MODEL_IDS = new Set<string>(MODEL_OPTIONS.map(m => m.id))

function deriveTitle(prompt: string): string {
  const clean = prompt.trim().replace(/\s+/g, ' ')
  return clean.length <= 60 ? clean : clean.slice(0, 57) + '…'
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { prompt, model } = body as { prompt?: unknown; model?: unknown }

  if (typeof prompt !== 'string' || !prompt.trim()) {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
  }
  if (typeof model !== 'string' || !VALID_MODEL_IDS.has(model)) {
    return NextResponse.json({ error: `model must be one of: ${[...VALID_MODEL_IDS].join(', ')}` }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('bot_runs')
    .insert({
      title:   deriveTitle(prompt),
      prompt:  prompt.trim(),
      model:   model as ModelId,
      status:  'queued',
      result:  null,
      user_id: null,
    })
    .select()
    .single()

  if (error) {
    console.error('[dispatch] Supabase error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
