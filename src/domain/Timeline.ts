export const TIMELINE_SPAN_HOURS = 48
export const SNAP_MINUTES = 15
export const RED_ZONE_MIN_HOURS = 4

export function snapTo15Min(date: Date): Date {
  const ms = date.getTime()
  const stepMs = SNAP_MINUTES * 60 * 1000
  return new Date(Math.round(ms / stepMs) * stepMs)
}

export function nextNineAM(now: Date): Date {
  const target = new Date(now)
  target.setHours(9, 0, 0, 0)
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1)
  }
  return target
}

export function minutesBetween(later: Date, earlier: Date): number {
  return (later.getTime() - earlier.getTime()) / (60 * 1000)
}

export function hoursBetween(later: Date, earlier: Date): number {
  return minutesBetween(later, earlier) / 60
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000)
}
