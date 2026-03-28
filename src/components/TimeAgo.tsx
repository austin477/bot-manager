'use client'
import { useEffect, useState } from 'react'

function format(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)  return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function TimeAgo({ date }: { date: string }) {
  const [label, setLabel] = useState(() => format(date))

  useEffect(() => {
    const id = setInterval(() => setLabel(format(date)), 10_000)
    return () => clearInterval(id)
  }, [date])

  return <span title={new Date(date).toLocaleString()}>{label}</span>
}
