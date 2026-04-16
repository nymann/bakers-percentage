export function formatBakeScheduleTime(date: Date): string {
  return date.toLocaleString([], {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
