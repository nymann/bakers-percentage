import * as Checkbox from '@radix-ui/react-checkbox'
import { useActiveBatch } from '../../../application/use-cases/useActiveBatch'
import type { ChecklistEntry } from '../../../application/use-cases/useActiveBatch'
import { EmptyState } from '../../../design-system/atoms/EmptyState'
import { LiveTime } from '../../../design-system/atoms/LiveTime'
import { useNow } from '../../../design-system/headless/useNow'
import { cn } from '../../../design-system/lib/utils'
import { formatRelative, relativeTo } from '../../../domain/Bake'
import type { ProgressStep } from '../../../domain/Bake'
import { formatBakeScheduleTime } from './format'
import { OvenGuidance } from './OvenGuidance'
import { DoneSignalsDialog } from './DoneSignalsDialog'

const FOCUS_REGION_ID = 'execution-focus'
const TIMELINE_REGION_ID = 'execution-full-schedule'
const TIMELINE_TICK_MS = 1_000

export interface ExecutionViewProps {
  onBakeFinished?: () => void
}

export function ExecutionView({ onBakeFinished }: ExecutionViewProps = {}) {
  const now = useNow({ intervalMs: TIMELINE_TICK_MS, enabled: true })
  const {
    batch,
    progress,
    focusSteps,
    checklistByPhase,
    bakePhaseStarted,
    toggleChecklist,
    toggleEventCompletion,
    selectOvenType,
    changePreheatMinutes,
    finishBake,
  } = useActiveBatch({ now })
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
          <p className="font-body text-on-surface-variant mt-2 text-sm inline-flex items-baseline flex-wrap gap-x-2">
            <span>Started {formatBakeScheduleTime(new Date(batch.startedAtMs))}</span>
            <span aria-hidden="true" className="text-on-surface-variant/50">·</span>
            <LiveTime
              value={formatRelative(relativeTo(batch.startedAtMs, nowMs))}
              className="italic text-on-surface-variant/70"
            />
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

      <FocusZone
        focusSteps={focusSteps}
        nowMs={nowMs}
        checklistByPhase={checklistByPhase}
        onToggleChecklist={toggleChecklist}
        onMarkStepDone={toggleEventCompletion}
        bakePhaseStarted={bakePhaseStarted}
      />

      <OvenGuidance
        selectedOven={batch.ovenType ?? null}
        onSelectOven={selectOvenType}
        preheatMinutes={batch.preheatMinutes ?? null}
        onChangePreheatMinutes={changePreheatMinutes}
      />

      <LiveTimeline
        progress={progress}
        nowMs={nowMs}
        onUndoStep={toggleEventCompletion}
      />
    </article>
  )
}

function FocusZone({
  focusSteps,
  nowMs,
  checklistByPhase,
  onToggleChecklist,
  onMarkStepDone,
  bakePhaseStarted,
}: {
  focusSteps: readonly ProgressStep[]
  nowMs: number
  checklistByPhase: ReadonlyMap<string, readonly ChecklistEntry[]>
  onToggleChecklist: (index: number) => void
  onMarkStepDone: (index: number) => void
  bakePhaseStarted: boolean
}) {
  return (
    <section
      aria-labelledby={FOCUS_REGION_ID}
      className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-[0_20px_40px_rgba(49,51,44,0.05)] border border-outline-variant/10 space-y-6"
    >
      <h2
        id={FOCUS_REGION_ID}
        className="font-label text-[0.7rem] uppercase tracking-[0.2em] text-on-surface-variant"
      >
        Now
      </h2>

      {focusSteps.length === 0 ? (
        <EmptyState title="No schedule captured" />
      ) : (
        <ol className="space-y-6">
          {focusSteps.map((step, idx) => (
            <FocusStepCard
              key={step.index}
              step={step}
              nowMs={nowMs}
              entries={checklistByPhase.get(step.event.name) ?? []}
              onToggleChecklist={onToggleChecklist}
              onMarkDone={onMarkStepDone}
              emphasis={idx === 0}
            />
          ))}

          {bakePhaseStarted && (
            <li>
              <DoneSignalsDialog />
            </li>
          )}
        </ol>
      )}
    </section>
  )
}

function FocusStepCard({
  step,
  nowMs,
  entries,
  onToggleChecklist,
  onMarkDone,
  emphasis,
}: {
  step: ProgressStep
  nowMs: number
  entries: readonly ChecklistEntry[]
  onToggleChecklist: (index: number) => void
  onMarkDone: (index: number) => void
  emphasis: boolean
}) {
  const relative = relativeTo(step.event.timeMs, nowMs)
  const isCurrent = step.status === 'current'
  const countdownPrefix = isCurrent
    ? relative.direction === 'future'
      ? 'Starts'
      : 'Started'
    : relative.direction === 'now'
      ? 'Now'
      : 'Starts'

  return (
    <li>
      <article
        data-status={step.status}
        className={cn(
          'rounded-xl px-4 sm:px-5 py-4 border transition-colors',
          emphasis
            ? 'border-primary/30 bg-primary-container/20'
            : 'border-outline-variant/20 bg-surface-container-low/60',
        )}
      >
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3
            className={cn(
              'font-headline text-xl sm:text-2xl italic leading-tight',
              isCurrent ? 'text-on-surface' : 'text-on-surface-variant',
            )}
          >
            {step.event.name}
          </h3>
          <p className="font-body text-sm text-on-surface-variant flex items-baseline flex-wrap gap-x-2">
            <span className="font-label uppercase tracking-widest text-[0.65rem] text-on-surface-variant/80 inline-flex items-baseline gap-1">
              <span
                aria-hidden="true"
                className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-live-pulse self-center"
              />
              {countdownPrefix}
            </span>
            <LiveTime
              value={formatRelative(relative)}
              className={cn(
                'font-headline italic',
                isCurrent ? 'text-primary' : 'text-on-surface',
              )}
            />
            <span className="text-on-surface-variant/70">
              · {formatBakeScheduleTime(new Date(step.event.timeMs))}
            </span>
          </p>
        </header>

        {entries.length > 0 && (
          <ul className="mt-3 space-y-2">
            {entries.map((entry) => (
              <ChecklistRow
                key={entry.index}
                entry={entry}
                onToggle={onToggleChecklist}
              />
            ))}
          </ul>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onMarkDone(step.index)}
            aria-label={`Mark ${step.event.name} done`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant/40 hover:border-primary hover:text-primary text-on-surface-variant font-label uppercase tracking-widest text-[0.65rem] transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined !text-[16px]">
              check
            </span>
            Mark done
          </button>
        </div>
      </article>
    </li>
  )
}

function ChecklistRow({
  entry,
  onToggle,
}: {
  entry: ChecklistEntry
  onToggle: (index: number) => void
}) {
  return (
    <li>
      <label className="flex items-center gap-3 cursor-pointer group">
        <Checkbox.Root
          checked={entry.item.checked}
          onCheckedChange={() => onToggle(entry.index)}
          className="w-5 h-5 rounded border border-outline-variant bg-surface-container-lowest data-[state=checked]:bg-primary data-[state=checked]:border-primary flex items-center justify-center focus:outline focus:outline-2 focus:outline-primary"
        >
          <Checkbox.Indicator className="text-on-primary text-sm">
            ✓
          </Checkbox.Indicator>
        </Checkbox.Root>
        <span
          className={cn(
            'font-body text-sm text-on-surface group-hover:text-primary transition-colors',
            entry.item.checked && 'line-through text-on-surface-variant',
          )}
        >
          {entry.item.label}
        </span>
      </label>
    </li>
  )
}

function LiveTimeline({
  progress,
  nowMs,
  onUndoStep,
}: {
  progress: readonly ProgressStep[]
  nowMs: number
  onUndoStep: (index: number) => void
}) {
  if (progress.length === 0) return null

  const first = progress[0]!
  const last = progress[progress.length - 1]!
  const spanMs = Math.max(1, last.event.timeMs - first.event.timeMs)
  const playheadPct =
    ((Math.min(last.event.timeMs, Math.max(first.event.timeMs, nowMs)) -
      first.event.timeMs) /
      spanMs) *
    100

  return (
    <section
      aria-labelledby={TIMELINE_REGION_ID}
      className="bg-surface-container-low rounded-2xl p-5 sm:p-6"
    >
      <h2
        id={TIMELINE_REGION_ID}
        className="font-label text-[0.7rem] uppercase tracking-[0.2em] text-on-surface-variant mb-5"
      >
        Full schedule
      </h2>

      <div className="relative h-1 bg-outline-variant/30 rounded-full mb-4">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-primary/60 rounded-full transition-[width] duration-1000 ease-linear"
          style={{ width: `${playheadPct}%` }}
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow ring-4 ring-primary/20 transition-[left] duration-1000 ease-linear"
          style={{ left: `${playheadPct}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <ol className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-2">
        {progress.map((step) => {
          const relative = relativeTo(step.event.timeMs, nowMs)
          const isCurrent = step.status === 'current'
          const isDone = step.status === 'done'
          return (
            <li
              key={step.index}
              aria-current={isCurrent ? 'step' : undefined}
              data-status={step.status}
              className={cn(
                'flex sm:flex-col sm:items-start gap-2 sm:gap-0.5 min-w-0 flex-1',
              )}
            >
              <span
                className={cn(
                  'font-body text-xs truncate',
                  isCurrent
                    ? 'text-primary font-semibold'
                    : isDone
                      ? 'text-on-surface-variant line-through'
                      : 'text-on-surface-variant',
                )}
              >
                {step.event.name}
              </span>
              <span className="font-headline italic text-[0.7rem] text-on-surface-variant/80 tabular-nums inline-flex items-baseline flex-wrap gap-x-1">
                <span>{formatBakeScheduleTime(new Date(step.event.timeMs))}</span>
                <span className="text-on-surface-variant/60">·</span>
                <LiveTime
                  value={formatRelative(relative)}
                  className="text-on-surface-variant/60"
                />
              </span>
              {isDone && (
                <button
                  type="button"
                  onClick={() => onUndoStep(step.index)}
                  aria-label={`Undo ${step.event.name}`}
                  className="font-label uppercase tracking-widest text-[0.6rem] text-on-surface-variant hover:text-primary underline decoration-dotted underline-offset-2"
                >
                  Undo
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
