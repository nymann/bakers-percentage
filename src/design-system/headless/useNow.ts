import { useEffect, useState } from 'react'

export interface UseNowOptions {
  readonly intervalMs?: number
  readonly enabled?: boolean
}

const DEFAULT_INTERVAL_MS = 30_000

export function useNow(options: UseNowOptions = {}): Date {
  const { intervalMs = DEFAULT_INTERVAL_MS, enabled = true } = options
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    if (!enabled) return
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, enabled])

  return now
}
