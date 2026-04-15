import { useCallback, useMemo, useState } from 'react'
import { FERMENTATION_DURATION_RANGE } from '../../domain/InputRanges'

function defaultBakeTime(now: Date): Date {
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  return tomorrow
}

export function useBakeTime(nowFn: () => Date = () => new Date()) {
  const now = useMemo(nowFn, [])
  const [bakeTime, setBakeTime] = useState(() => defaultBakeTime(now))

  const duration = useMemo(() => {
    const hours = (bakeTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    return Math.max(FERMENTATION_DURATION_RANGE.min, Math.round(hours))
  }, [bakeTime, now])

  const changeBakeTime = useCallback((time: Date) => {
    setBakeTime(time)
  }, [])

  return { bakeTime, duration, changeBakeTime }
}
