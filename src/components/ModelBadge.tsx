import type { ModelId } from '@/types'
import { MODEL_OPTIONS } from '@/types'

const PROVIDER_COLOR: Record<string, string> = {
  Anthropic: 'text-orange-300 bg-orange-950/60',
  OpenAI:    'text-emerald-300 bg-emerald-950/60',
  Google:    'text-blue-300 bg-blue-950/60',
}

export default function ModelBadge({ model }: { model: ModelId }) {
  const opt = MODEL_OPTIONS.find(m => m.id === model)
  if (!opt) return <span className="text-slate-500 text-xs font-mono">{model}</span>
  const color = PROVIDER_COLOR[opt.provider] ?? 'text-slate-300 bg-slate-800'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {opt.label}
    </span>
  )
}
