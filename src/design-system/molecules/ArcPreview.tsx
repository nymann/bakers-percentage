import { useId, useState } from 'react'

export type ArcStep = {
  id: string
  label: string
  time: string
  isPast: boolean
}

export type ArcPreviewProps = {
  steps: readonly ArcStep[]
  title?: string
}

export function ArcPreview({ steps, title = 'Baking schedule' }: ArcPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const listId = useId()
  const currentIndex = steps.findIndex((s) => !s.isPast)
  const nextStep = currentIndex >= 0 ? steps[currentIndex] : null
  const teaser = nextStep
    ? `Next: ${nextStep.label} · ${nextStep.time}`
    : `${steps.length} steps`

  return (
    <section
      aria-label={title}
      className="bg-surface-container-low rounded-2xl overflow-hidden"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-surface-container transition-colors"
      >
        <span className="flex items-baseline gap-3 min-w-0">
          <span className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant shrink-0">
            {title}
          </span>
          <span className="font-body text-sm text-on-surface truncate">
            {teaser}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="material-symbols-outlined !text-[20px] text-on-surface-variant shrink-0"
        >
          {isOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {isOpen && (
        <ol
          id={listId}
          className="space-y-2 px-5 pt-3 pb-5 border-t border-outline-variant/15"
        >
          {steps.map((step, idx) => {
            const isCurrent = idx === currentIndex
            return (
              <li
                key={step.id}
                aria-current={isCurrent ? 'step' : undefined}
                className={[
                  'flex items-center gap-3',
                  step.isPast ? 'opacity-60' : '',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'w-2 h-2 rounded-full',
                    isCurrent
                      ? 'bg-primary'
                      : step.isPast
                        ? 'bg-outline-variant/50'
                        : 'border border-outline-variant',
                  ].join(' ')}
                />
                <span className="text-xs font-body">
                  <span className={isCurrent ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}>
                    {step.label}
                  </span>
                  <span className="italic ml-2 text-on-surface-variant">{step.time}</span>
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
