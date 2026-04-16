export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function formatDatetimeLocal(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

export function formatScheduleTime(date: Date): string {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m} ${dayNames[date.getDay()]}`
}

export function formatRangeValue(value: number, unit: string): string {
  if (unit === '%') return String(Math.round(value * 100))
  return String(value)
}
