import * as Checkbox from '@radix-ui/react-checkbox'
import { useActiveBatch } from '../../../application/use-cases/useActiveBatch'
import { EmptyState } from '../../../design-system/atoms/EmptyState'
import { useNow } from '../../../design-system/headless/useNow'
import { cn } from '../../../design-system/lib/utils'
import { formatRelative, relativeTo } from '../../../domain/Bake'
import { formatBakeScheduleTime } from './format'
import { BakingGuidance } from './BakingGuidance'

const CHECKLIST_HEADING_ID = 'execution-step-checklist'
const ARC_HEADING_ID = 'execution-progress-arc'

export interface ExecutionViewProps {
  onBakeFinished?: () => void
}

export function ExecutionView({ onBakeFinished }: ExecutionViewProps = {}) {
  const now = useNow({ enabled: true })
  const { batch, progress, toggleChecklist, finishBake } = useActiveBatch({ now })
  const nowMs = now.getTime()

  if (!batch) {
    return (
      <article className="space-y-8">
        <header>
          <span className="font-label text-primary uppercase tracking-[0.2em] text-[0.7rem] block mb-2">
            Current Bake
          </span>
          <h1 className="font-headline text-5xl text-on-surface leading-tight italic">
            No Active Batch
          </h1>
        </header>
        <EmptyState
          title="No bake in progress"
          description="Start a bake from the Planning view to track it here."
        />
      </article>
    )
  }

  const handleFinish = () => {
    finishBake(new Date())
    onBakeFinished?.()
  }

  return (
    <article className="space-y-10 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <span className="font-label text-primary uppercase tracking-[0.2em] text-[0.7rem] block mb-2">
            Current Bake
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl text-on-surface leading-tight italic">
            {batch.name}
          </h1>
          <p className="font-body text-on-surface-variant mt-2 text-sm">
            Started {formatBakeScheduleTime(new Date(batch.startedAtMs))}
            <span className="italic ml-2 text-on-surface-variant/70">
              · {formatRelative(relativeTo(batch.startedAtMs, nowMs))}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-on-primary font-label uppercase tracking-widest text-[0.75rem] hover:bg-primary/90 transition-colors self-start"
        >
          <span aria-hidden="true" className="material-symbols-outlined !text-[18px]">
            done_all
          </span>
          Finish bake
        </button>
      </header>

      <section
        aria-labelledby={CHECKLIST_HEADING_ID}
        className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-[0_20px_40px_rgba(49,51,44,0.05)] border border-outline-variant/10"
      >
        <h2
          id={CHECKLIST_HEADING_ID}
          className="font-headline text-2xl mb-6"
        >
          Step Checklist
        </h2>
        {batch.checklist.length === 0 ? (
          <EmptyState title="No manual steps for this bake" />
        ) : (
          <ul className="space-y-4">
            {batch.checklist.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <label className="flex items-center gap-4 cursor-pointer group">
                  <Checkbox.Root
                    checked={item.checked}
                    onCheckedChange={() => toggleChecklist(index)}
                    className="w-5 h-5 rounded border border-outline-variant bg-surface-container-lowest data-[state=checked]:bg-primary data-[state=checked]:border-primary flex items-center justify-center focus:outline focus:outline-2 focus:outline-primary"
                  >
                    <Checkbox.Indicator className="text-on-primary text-sm">
                      ✓
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span
                    className={cn(
                      'font-body text-on-surface group-hover:text-primary transition-colors',
                      item.checked && 'line-through text-on-surface-variant',
                    )}
                  >
                    {item.label}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <BakingGuidance />

      <section
        aria-labelledby={ARC_HEADING_ID}
        className="bg-surface-container-low p-6 sm:p-8 rounded-2xl"
      >
        <h2
          id={ARC_HEADING_ID}
          className="font-headline text-2xl mb-6"
        >
          Progress Arc
        </h2>
        {progress.length === 0 ? (
          <EmptyState title="No schedule captured" />
        ) : (
          <ol className="space-y-3">
            {progress.map(({ event, status }, idx) => {
              const relative = relativeTo(event.timeMs, nowMs)
              const isCurrent = status === 'current'
              const isUpcoming = status === 'upcoming'
              const showRelative = isCurrent || isUpcoming
              return (
                <li
                  key={`${event.name}-${idx}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  data-status={status}
                  className={cn(
                    'flex items-center justify-between gap-4 py-2',
                    status === 'done' && 'opacity-60',
                    isUpcoming && 'opacity-50',
                  )}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <span
                      aria-hidden="true"
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        isCurrent
                          ? 'bg-primary'
                          : status === 'done'
                            ? 'bg-outline-variant/50'
                            : 'border border-outline-variant',
                      )}
                    />
                    <span className="min-w-0 flex flex-col">
                      <span
                        className={cn(
                          'font-body truncate',
                          isCurrent
                            ? 'text-on-surface font-semibold'
                            : 'text-on-surface-variant',
                        )}
                      >
                        {event.name}
                      </span>
                      {isCurrent && (
                        <span className="font-body italic text-xs text-primary/80">
                          {formatRelative(relative)}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="flex flex-col items-end shrink-0">
                    <span className="font-headline italic text-sm text-on-surface-variant tabular-nums">
                      {formatBakeScheduleTime(new Date(event.timeMs))}
                    </span>
                    {showRelative && !isCurrent && (
                      <span className="font-body italic text-[0.7rem] text-on-surface-variant/60">
                        {formatRelative(relative)}
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </article>
  )
}
