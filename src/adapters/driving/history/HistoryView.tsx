import { useState } from 'react'
import { useBakeHistory } from '../../../application/use-cases/useBakeHistory'
import { EmptyState } from '../../../design-system/atoms/EmptyState'
import { Ledger, type LedgerRow } from '../../../design-system/molecules/Ledger'
import { cn } from '../../../design-system/lib/utils'
import { formatBakeScheduleTime } from '../execution/format'
import type { FinishedBake } from '../../../domain/Bake'
import type { PlanningPreferences } from '../../../domain/PlanningPreferences'

const PAST_BAKES_HEADING_ID = 'history-past-bakes'
const DETAIL_PANE_HEADING_ID = 'history-bake-detail'

export interface HistoryViewProps {
  onRetryBake?: (prefs: PlanningPreferences, name: string) => void
}

export function HistoryView({ onRetryBake }: HistoryViewProps = {}) {
  const { bakes, isEmpty, selected, select, remove, updateNotes } = useBakeHistory()

  return (
    <article className="space-y-12 animate-fade-in">
      <header>
        <span className="font-label text-primary uppercase tracking-[0.2em] text-[0.7rem] block mb-2">
          Past Bakes
        </span>
        <h1 className="font-headline text-5xl text-on-surface leading-tight italic">
          History
        </h1>
        <p className="font-body text-on-surface-variant mt-2">
          Revisit past bakes to repeat what worked.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <section
          aria-labelledby={PAST_BAKES_HEADING_ID}
          className="md:col-span-5 bg-surface-container-low p-6 rounded-2xl"
        >
          <h2
            id={PAST_BAKES_HEADING_ID}
            className="font-headline text-2xl mb-6"
          >
            Past Bakes
          </h2>
          {isEmpty ? (
            <EmptyState
              title="No past bakes yet"
              description="Completed batches will appear here."
            />
          ) : (
            <ul className="space-y-2">
              {bakes.map((bake, idx) => {
                const isSelected = selected?.id === bake.id
                return (
                  <li
                    key={bake.id}
                    className="animate-slide-up-fade"
                    style={{ animationDelay: `${Math.min(idx, 6) * 40}ms` }}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => select(bake.id)}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex-1 text-left px-4 py-3 rounded-xl transition-all duration-200 ease-out hover:-translate-y-[1px]',
                          isSelected
                            ? 'bg-surface-container-lowest border border-primary/40 shadow-sm'
                            : 'bg-transparent hover:bg-surface-container-lowest/60 border border-transparent',
                        )}
                      >
                        <span className="font-body text-on-surface block">
                          {bake.name}
                        </span>
                        <span className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant">
                          Finished {formatBakeScheduleTime(new Date(bake.finishedAtMs))}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(bake.id)}
                        aria-label={`Remove ${bake.name}`}
                        className="p-2 rounded-full text-on-surface-variant/60 hover:text-error hover:bg-surface-container-lowest transition-all duration-200 hover:scale-110"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined !text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section
          aria-labelledby={DETAIL_PANE_HEADING_ID}
          className="md:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-[0_20px_40px_rgba(49,51,44,0.03)] border border-outline-variant/10"
        >
          <h2
            id={DETAIL_PANE_HEADING_ID}
            className="font-headline text-2xl mb-6"
          >
            Bake Detail
          </h2>
          {selected ? (
            <BakeDetail
              bake={selected}
              onChangeNotes={(notes) => updateNotes(selected.id, notes)}
              onRetry={
                selected.preferences && onRetryBake
                  ? () => onRetryBake(selected.preferences!, selected.name)
                  : undefined
              }
            />
          ) : (
            <p className="font-body text-on-surface-variant italic">
              Select a past bake to see its formula and timeline.
            </p>
          )}
        </section>
      </div>
    </article>
  )
}

function formatPercentage(fraction: number): string {
  return `${Math.round(fraction * 100)}%`
}

function BakeDetail({
  bake,
  onChangeNotes,
  onRetry,
}: {
  bake: FinishedBake
  onChangeNotes: (notes: string) => void
  onRetry?: () => void
}) {
  const rows: LedgerRow[] = bake.recipe.ingredients.map((ing) => ({
    name: ing.name,
    grams: ing.grams,
    total: bake.recipe.loaves > 1 ? ing.grams * bake.recipe.loaves : undefined,
    percentage: formatPercentage(ing.percentage),
  }))

  return (
    <div className="space-y-6 animate-fade-in" key={bake.id}>
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-headline italic text-2xl text-on-surface">{bake.name}</h3>
          <p className="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant mt-1">
            Started {formatBakeScheduleTime(new Date(bake.startedAtMs))} · Finished{' '}
            {formatBakeScheduleTime(new Date(bake.finishedAtMs))}
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-label uppercase tracking-[0.18em] text-[0.7rem] shadow-[0_6px_16px_rgba(49,51,44,0.08)] hover:shadow-[0_10px_22px_rgba(49,51,44,0.14)] hover:-translate-y-0.5 transition-all self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span
              aria-hidden="true"
              className="material-symbols-outlined !text-[18px] transition-transform group-hover:-rotate-45"
            >
              refresh
            </span>
            Retry bake
          </button>
        )}
      </header>

      <Ledger
        rows={rows}
        multiLoaf={bake.recipe.loaves > 1}
        totalDoughWeight={bake.recipe.totalDoughWeight}
        finishedLoafWeight={bake.recipe.finishedWeightPerLoaf}
        hydrationPercent={bake.recipe.hydration}
      />

      {bake.schedule.length > 0 && (
        <section aria-label="Bake timeline" className="space-y-2">
          <h4 className="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant">
            Timeline
          </h4>
          <ol className="space-y-2">
            {bake.schedule.map((event, idx) => (
              <li key={`${event.name}-${idx}`} className="flex items-center justify-between gap-4">
                <span className="font-body text-on-surface-variant">{event.name}</span>
                <span className="font-headline italic text-sm text-on-surface-variant tabular-nums">
                  {formatBakeScheduleTime(new Date(event.timeMs))}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {bake.checklist.length > 0 && (
        <section aria-label="Checklist outcome" className="space-y-2">
          <h4 className="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant">
            Checklist
          </h4>
          <ul className="space-y-1">
            {bake.checklist.map((item, idx) => (
              <li
                key={`${item.label}-${idx}`}
                className={cn(
                  'flex items-center gap-2 text-sm',
                  item.checked ? 'text-on-surface' : 'text-on-surface-variant',
                )}
              >
                <span aria-hidden="true" className="material-symbols-outlined !text-[16px]">
                  {item.checked ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={cn(item.checked && 'line-through')}>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <BakeNotesField key={bake.id} initialNotes={bake.notes ?? ''} onCommit={onChangeNotes} />
    </div>
  )
}

function BakeNotesField({
  initialNotes,
  onCommit,
}: {
  initialNotes: string
  onCommit: (notes: string) => void
}) {
  const [draft, setDraft] = useState(initialNotes)

  const commit = () => {
    if (draft !== initialNotes) onCommit(draft)
  }

  return (
    <section aria-label="Bake notes" className="space-y-2">
      <label className="font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
        <span aria-hidden="true" className="material-symbols-outlined !text-[14px]">
          edit_note
        </span>
        Notes
      </label>
      <textarea
        aria-label="Bake notes"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        placeholder="What would you do differently next time? (steam, scoring depth, oven timing…)"
        rows={3}
        className="w-full resize-y min-h-[4.5rem] bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-3 py-2 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 placeholder:italic focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
      />
    </section>
  )
}
