import type { ScheduleEvent } from '../../../../domain/BakingSchedule'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '../../../../design-system/atoms/Table'
import { tokens } from '../../../../design-system/tokens'
import { formatScheduleTime } from '../format'

export function BakingScheduleTable({ events }: { events: ScheduleEvent[] }) {
  if (events.length === 0) return null

  return (
    <section aria-label="Baking schedule" style={{ marginTop: tokens.spacing.lg }}>
      <h2>Baking Schedule</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Step</TableHeader>
            <TableHeader>Time</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.name}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{formatScheduleTime(event.time)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
