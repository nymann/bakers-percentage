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
  const currentIndex = steps.findIndex((s) => !s.isPast)

  return (
    <section
      aria-label={title}
      className="p-6 bg-surface-container-low rounded-2xl"
    >
      <h3 className="font-label text-[0.65rem] uppercase tracking-widest text-on-surface-variant mb-4">
        {title}
      </h3>
      <ol className="space-y-3 relative">
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
    </section>
  )
}
