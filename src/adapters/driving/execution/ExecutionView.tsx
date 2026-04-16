import * as Checkbox from '@radix-ui/react-checkbox'
import { useActiveBatch } from '../../../application/use-cases/useActiveBatch'
import {
  useBakingArc,
  type ArcStep,
} from '../../../application/use-cases/useBakingArc'
import { useCheckboxList } from '../../../design-system/headless/useCheckboxList'
import { useProgressStep } from '../../../design-system/headless/useProgressStep'
import { cn } from '../../../design-system/lib/utils'

const FOLD_STEPS: readonly string[] = [
  'First Fold (Initial strength)',
  'Second Fold (Lamination)',
  'Third Fold (Coil fold)',
]

const SAMPLE_ARC_STEPS: readonly ArcStep[] = [
  { id: 'autolyse', label: 'Autolyse', status: 'done' },
  { id: 'bulk-ferment', label: 'Bulk Fermentation', status: 'current' },
  { id: 'preshape', label: 'Preshape & Bench Rest', status: 'upcoming' },
]

const CHECKLIST_HEADING_ID = 'execution-step-checklist'
const ARC_HEADING_ID = 'execution-progress-arc'

export function ExecutionView() {
  const { batch } = useActiveBatch()
  const { steps: liveArcSteps } = useBakingArc()
  const checklist = useCheckboxList({ items: FOLD_STEPS })
  const progress = useProgressStep({
    steps: liveArcSteps.length > 0 ? liveArcSteps : SAMPLE_ARC_STEPS,
  })

  const heading = batch?.name ?? 'No Active Batch'

  return (
    <article className="space-y-12">
      <header>
        <span className="font-label text-primary uppercase tracking-[0.2em] text-[0.7rem] block mb-2">
          Current Bake
        </span>
        <h1 className="font-headline text-5xl text-on-surface leading-tight italic">
          {heading}
        </h1>
        <p className="font-body text-on-surface-variant mt-2">
          Fold checklist and progress arc below. Placeholder content — live
          tracking coming soon.
        </p>
      </header>

      <section
        aria-labelledby={CHECKLIST_HEADING_ID}
        className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_20px_40px_rgba(49,51,44,0.05)] border border-outline-variant/10"
      >
        <h2
          id={CHECKLIST_HEADING_ID}
          className="font-headline text-2xl mb-6"
        >
          Step Checklist
        </h2>
        <ul className="space-y-4">
          {checklist.items.map((item, index) => (
            <li key={item.label}>
              <label className="flex items-center gap-4 cursor-pointer group">
                <Checkbox.Root
                  checked={item.checked}
                  onCheckedChange={() => checklist.toggle(index)}
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
      </section>

      <section
        aria-labelledby={ARC_HEADING_ID}
        className="bg-surface-container-low p-8 rounded-2xl"
      >
        <h2
          id={ARC_HEADING_ID}
          className="font-headline text-2xl mb-6"
        >
          Progress Arc
        </h2>
        <ol className="space-y-4">
          {progress.steps.map((step) => {
            const itemProps = step.getItemProps()
            return (
              <li
                key={step.id}
                aria-current={itemProps['aria-current']}
                data-status={itemProps['data-status']}
                className={cn(
                  'flex items-center gap-4 py-2',
                  step.status === 'done' && 'opacity-60',
                  step.status === 'upcoming' && 'opacity-40',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'w-2 h-2 rounded-full',
                    step.status === 'current'
                      ? 'bg-primary'
                      : 'bg-outline-variant/50',
                  )}
                />
                <span className="font-body text-on-surface">{step.label}</span>
              </li>
            )
          })}
        </ol>
      </section>
    </article>
  )
}
