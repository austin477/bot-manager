'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { BotRun } from '@/types'
import NewBotForm from './NewBotForm'
import RunCard from './RunCard'

export default function Dashboard() {
  const [runs, setRuns] = useState<BotRun[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRuns = useCallback(async () => {
    const { data, error } = await supabase
      .from('bot_runs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (!error && data) setRuns(data as BotRun[])
    setLoading(false)
  }, [])

  // Initial load
  useEffect(() => { fetchRuns() }, [fetchRuns])

  // Realtime subscription for live status updates
  useEffect(() => {
    const channel = supabase
      .channel('bot_runs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bot_runs' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRuns(prev => [payload.new as BotRun, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setRuns(prev =>
              prev.map(r => r.id === (payload.new as BotRun).id ? payload.new as BotRun : r)
            )
          } else if (payload.eventType === 'DELETE') {
            setRuns(prev => prev.filter(r => r.id !== (payload.old as BotRun).id))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const activeRuns    = runs.filter(r => r.status === 'queued' || r.status === 'running')
  const completedRuns = runs.filter(r => r.status === 'completed' || r.status === 'failed')

  return (
    <div className="space-y-6">
      <NewBotForm onDispatched={fetchRuns} />

      {loading ? (
        <div className="text-center text-slate-500 text-sm py-12">Loading runs…</div>
      ) : (
        <>
          {/* Active runs */}
          <section>
            <SectionHeader
              label="Active"
              count={activeRuns.length}
              dot="bg-yellow-400 animate-pulse"
            />
            {activeRuns.length === 0 ? (
              <EmptyState message="No active runs" />
            ) : (
              <div className="space-y-3">
                {activeRuns.map(r => <RunCard key={r.id} run={r} />)}
              </div>
            )}
          </section>

          {/* Completed runs */}
          <section>
            <SectionHeader
              label="Completed"
              count={completedRuns.length}
              dot="bg-green-400"
            />
            {completedRuns.length === 0 ? (
              <EmptyState message="No completed runs yet" />
            ) : (
              <div className="space-y-3">
                {completedRuns.map(r => <RunCard key={r.id} run={r} />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function SectionHeader({ label, count, dot }: { label: string; count: number; dot: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{label}</h2>
      <span className="ml-1 text-xs font-mono text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded">
        {count}
      </span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="card p-6 text-center text-sm text-slate-600">{message}</div>
  )
}
