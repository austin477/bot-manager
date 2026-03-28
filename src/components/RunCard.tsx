'use client'
import { useState } from 'react'
import type { BotRun } from '@/types'
import StatusBadge from './StatusBadge'
import ModelBadge from './ModelBadge'
import TimeAgo from './TimeAgo'

export default function RunCard({ run }: { run: BotRun }) {
  const [expanded, setExpanded] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const hasResult = Boolean(run.result?.trim())
  const isActive = run.status === 'queued' || run.status === 'running'

  async function handleCancel() {
    setCancelling(true)
    try {
      await fetch(`/api/bots/runs/${run.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'failed' }),
      })
    } catch {
      // Realtime will reflect the true state; swallow UI errors
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-100 truncate">{run.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{run.prompt}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge status={run.status} />
          <ModelBadge model={run.model} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <TimeAgo date={run.created_at} />
        <div className="flex items-center gap-3">
          {isActive && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling…' : 'Cancel'}
            </button>
          )}
          {hasResult && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              {expanded ? 'Hide result' : 'View result'}
            </button>
          )}
        </div>
      </div>

      {expanded && hasResult && (
        <div className="bg-surface-800 border border-slate-700 rounded-lg p-3 space-y-1">
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">Result</p>
          <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap break-words max-h-96 overflow-y-auto leading-relaxed">
            {run.result}
          </pre>
        </div>
      )}
    </div>
  )
}
