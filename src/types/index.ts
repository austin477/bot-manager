export type BotStatus = 'queued' | 'running' | 'completed' | 'failed'

export type ModelId =
  | 'claude-opus-4-6'
  | 'claude-sonnet-4-6'
  | 'claude-haiku-4-5-20251001'
  | 'gpt-4o'
  | 'gemini-pro'

export interface BotRun {
  id: string
  title: string
  prompt: string
  model: ModelId
  status: BotStatus
  result: string | null
  created_at: string
  updated_at: string
  user_id: string | null
}

export interface BotTemplate {
  id: string
  name: string
  description: string
  default_prompt: string
  default_model: ModelId
  tools: string[]
  created_at: string
  user_id: string | null
}

export const MODEL_OPTIONS: { id: ModelId; label: string; provider: string }[] = [
  { id: 'claude-opus-4-6',          label: 'Claude Opus 4.6',   provider: 'Anthropic' },
  { id: 'claude-sonnet-4-6',        label: 'Claude Sonnet 4.6', provider: 'Anthropic' },
  { id: 'claude-haiku-4-5-20251001',label: 'Claude Haiku 4.5',  provider: 'Anthropic' },
  { id: 'gpt-4o',                   label: 'GPT-4o',            provider: 'OpenAI'    },
  { id: 'gemini-pro',               label: 'Gemini Pro',        provider: 'Google'    },
]
