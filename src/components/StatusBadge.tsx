'use client'
import type { BotStatus } from '@/types'

const DOT_COLOR: Record<BotStatus, string> = {
  queued:    'bg-slate-400',
  running:   'bg-yellow-400 animate-pulse',
  completed: 'bg-green-400',
  failed:    'bg-red-400',
}

const LABEL: Record<BotStatus, string> = {
  queued:    'Queued',
  running:   'Running',
  completed: 'Completed',
  failed:    'Failed',
}

export default function StatusBadge({ status }: { status: BotStatus }) {
  return (
    <span className={`status-${status}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${DOT_COLOR[status]}`} />
      {LABEL[status]}
    </span>
  )
}
