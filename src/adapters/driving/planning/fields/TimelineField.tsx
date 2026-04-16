import { tokens } from '../../../../design-system/tokens'
import type { useTimeline } from '../../../../application/use-cases/useTimeline'
import { TIMELINE_SPAN_HOURS } from '../../../../domain/Timeline'

type TimelineState = ReturnType<typeof useTimeline>

export function TimelineField({ timeline }: { timeline: TimelineState }) {
  const bakeProps = timeline.getBakeHandleProps()
  const mixProps = timeline.getMixHandleProps()

  return (
    <div
      role="group"
      aria-label="Baking timeline"
      aria-description={`Drag handles to plan mix and bake across the next ${TIMELINE_SPAN_HOURS} hours`}
      style={{
        marginBottom: tokens.spacing.md,
        padding: tokens.spacing.md,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.spacing.xs,
      }}
    >
      <label style={{ display: 'block', marginBottom: tokens.spacing.sm }}>
        Mix handle
        <input aria-label="Mix handle" {...mixProps} style={{ width: '100%' }} />
      </label>
      <label style={{ display: 'block' }}>
        Bake handle
        <input aria-label="Bake handle" {...bakeProps} style={{ width: '100%' }} />
      </label>
      {timeline.isMixInRedZone && (
        <p role="alert" style={{ marginTop: tokens.spacing.sm }}>
          Mix is too close to bake — move it further back to enable the recipe.
        </p>
      )}
    </div>
  )
}
