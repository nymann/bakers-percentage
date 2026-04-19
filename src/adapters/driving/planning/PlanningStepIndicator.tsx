import type { UsePlanningWizard } from '../../../application/use-cases/usePlanningWizard'

interface Step {
  readonly id: 'setup' | 'timing'
  readonly label: string
  readonly index: 1 | 2
}

const STEPS: readonly Step[] = [
  { id: 'setup', label: 'Setup', index: 1 },
  { id: 'timing', label: 'Timing', index: 2 },
]

export function PlanningStepIndicator({ wizard }: { wizard: UsePlanningWizard }) {
  return (
    <ol
      aria-label="Planning steps"
      className="flex items-center gap-2 px-1"
    >
      {STEPS.map((step, idx) => {
        const props = wizard.getStepIndicatorProps(step.id)
        const isCurrent = props['aria-current'] === 'step'
        return (
          <li key={step.id} className="flex items-center gap-2">
            <button
              {...props}
              id={`planning-step-${step.id}`}
              className={
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-label text-[0.75rem] uppercase tracking-widest transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
                (isCurrent
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container')
              }
            >
              <span
                aria-hidden="true"
                className={
                  'inline-flex items-center justify-center w-5 h-5 rounded-full text-[0.7rem] font-semibold ' +
                  (isCurrent
                    ? 'bg-on-primary/20 text-on-primary'
                    : 'bg-outline-variant/20 text-on-surface-variant')
                }
              >
                {step.index}
              </span>
              {step.label}
            </button>
            {idx < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="h-px w-6 bg-outline-variant/30"
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
