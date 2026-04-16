import { useBakeHistory } from '../../../application/use-cases/useBakeHistory'
import { EmptyState } from '../../../design-system/atoms/EmptyState'

const PAST_BAKES_HEADING_ID = 'history-past-bakes'
const DETAIL_PANE_HEADING_ID = 'history-bake-detail'

export function HistoryView() {
  const { bakes, isEmpty } = useBakeHistory()

  return (
    <article className="space-y-12">
      <header>
        <span className="font-label text-primary uppercase tracking-[0.2em] text-[0.7rem] block mb-2">
          Past Bakes
        </span>
        <h1 className="font-headline text-5xl text-on-surface leading-tight italic">
          History
        </h1>
        <p className="font-body text-on-surface-variant mt-2">
          Revisit past bakes to repeat what worked. Live history coming soon.
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
              {bakes.map((bake) => (
                <li key={bake.id}>{bake.name}</li>
              ))}
            </ul>
          )}
        </section>

        <section
          aria-labelledby={DETAIL_PANE_HEADING_ID}
          className="md:col-span-7 bg-surface-container-lowest p-8 rounded-2xl shadow-[0_20px_40px_rgba(49,51,44,0.03)] border border-outline-variant/10"
        >
          <h2
            id={DETAIL_PANE_HEADING_ID}
            className="font-headline text-2xl mb-6"
          >
            Bake Detail
          </h2>
          <p className="font-body text-on-surface-variant italic">
            Select a past bake to see its formula and timeline.
          </p>
        </section>
      </div>
    </article>
  )
}
