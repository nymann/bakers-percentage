import { useCallback, useMemo, useState } from 'react'
import { FERMENTATION_DURATION_RANGE } from '../../domain/InputRanges'

function initialBakeTime(now: Date, durationHours: number): Date {
  return new Date(now.getTime() + durationHours * 60 * 60 * 1000)
}

export function useBakeTime(initialDurationHours: number, nowFn: () => Date = () => new Date()) {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- capture `now` once on mount
  const now = useMemo(() => nowFn(), [])
  const [bakeTime, setBakeTime] = useState(() => initialBakeTime(now, initialDurationHours))

  const duration = useMemo(() => {
    const hours = (bakeTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    return Math.max(FERMENTATION_DURATION_RANGE.min, Math.round(hours))
  }, [bakeTime, now])

  const changeBakeTime = useCallback((time: Date) => {
    setBakeTime(time)
  }, [])

  return { bakeTime, duration, changeBakeTime }
}
