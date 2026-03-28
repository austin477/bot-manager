'use client'
import { useState } from 'react'
import { MODEL_OPTIONS, type ModelId } from '@/types'

interface Props {
  onDispatched: () => void
}

export default function NewBotForm({ onDispatched }: Props) {
  const [prompt, setPrompt] = useState('')
  const [model, setModel]   = useState<ModelId>('claude-sonnet-4-6')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/bots/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), model }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      setPrompt('')
      onDispatched()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-4">
      <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
        Dispatch New Bot
      </h2>

      <div className="space-y-1.5">
        <label className="text-xs text-slate-400" htmlFor="prompt">Task description</label>
        <textarea
          id="prompt"
          className="input min-h-[120px] resize-y"
          placeholder="Describe what the bot should do…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-slate-400" htmlFor="model">Model</label>
        <select
          id="model"
          className="input"
          value={model}
          onChange={e => setModel(e.target.value as ModelId)}
          disabled={loading}
        >
          {MODEL_OPTIONS.map(m => (
            <option key={m.id} value={m.id}>
              {m.label} — {m.provider}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-xs text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <>
            <Spinner />
            Dispatching…
          </>
        ) : (
          'Dispatch Bot'
        )}
      </button>
    </form>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}
