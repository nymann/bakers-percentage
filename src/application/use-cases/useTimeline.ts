import { useCallback, useMemo, useState, type ChangeEvent } from 'react'
import {
  TIMELINE_SPAN_HOURS,
  SNAP_MINUTES,
  RED_ZONE_MIN_HOURS,
  snapTo15Min,
  nextNineAM,
  hoursBetween,
  minutesBetween,
  addMinutes,
} from '../../domain/Timeline'

const DEFAULT_DURATION_HOURS = 14

type HandleProps = {
  type: 'range'
  min: number
  max: number
  step: number
  value: number
  'aria-valuetext': string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function useTimeline(nowFn: () => Date = () => new Date()) {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- capture `now` once on mount
  const now = useMemo(() => nowFn(), [])

  const [bakeTime, setBakeTime] = useState<Date>(() => nextNineAM(now))
  const [mixTime, setMixTime] = useState<Date>(
    () => addMinutes(nextNineAM(now), -DEFAULT_DURATION_HOURS * 60),
  )

  const duration = useMemo(() => hoursBetween(bakeTime, mixTime), [bakeTime, mixTime])
  const isMixInRedZone = duration < RED_ZONE_MIN_HOURS

  const changeBakeTime = useCallback((date: Date) => {
    setBakeTime(snapTo15Min(date))
  }, [])

  const changeMixTime = useCallback((date: Date) => {
    setMixTime(snapTo15Min(date))
  }, [])

  const getBakeHandleProps = useCallback((): HandleProps => ({
    type: 'range',
    min: 0,
    max: TIMELINE_SPAN_HOURS * 60,
    step: SNAP_MINUTES,
    value: Math.round(minutesBetween(bakeTime, now)),
    'aria-valuetext': formatTime(bakeTime),
    onChange: (event) => {
      const minutes = Number(event.target.value)
      changeBakeTime(addMinutes(now, minutes))
    },
  }), [bakeTime, now, changeBakeTime])

  const getMixHandleProps = useCallback((): HandleProps => ({
    type: 'range',
    min: 0,
    max: TIMELINE_SPAN_HOURS * 60,
    step: SNAP_MINUTES,
    value: Math.round(minutesBetween(mixTime, now)),
    'aria-valuetext': formatTime(mixTime),
    onChange: (event) => {
      const minutes = Number(event.target.value)
      changeMixTime(addMinutes(now, minutes))
    },
  }), [mixTime, now, changeMixTime])

  return {
    now,
    bakeTime,
    mixTime,
    duration,
    isMixInRedZone,
    changeBakeTime,
    changeMixTime,
    getBakeHandleProps,
    getMixHandleProps,
  }
}
