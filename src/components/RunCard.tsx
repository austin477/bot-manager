'use client'
import { useState } from 'react'
import type { BotRun } from '@/types'
import StatusBadge from './StatusBadge'
import ModelBadge from './ModelBadge'
import TimeAgo from './TimeAgo'

export default function RunCard({ run }: { run: BotRun }) {
  const [expanded, setExpanded] = useState(false)
  const hasResult = run.result && run.result.trim().length > 0

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
        {hasResult && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            {expanded ? 'Hide result' : 'View result'}
          </button>
        )}
      </div>

      {expanded && hasResult && (
        <div className="bg-surface-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-64 overflow-y-auto">
          {run.result}
        </div>
      )}
    </div>
  )
}
