import { useMemo } from 'react'

export type ProgressStepStatus = 'done' | 'current' | 'upcoming'

export interface ProgressStepInput {
  readonly id: string
  readonly label: string
  readonly status: ProgressStepStatus
}

export interface ProgressStepItemProps {
  readonly 'aria-current'?: 'step'
  readonly 'data-status': ProgressStepStatus
}

export interface ProgressStepItem extends ProgressStepInput {
  getItemProps: () => ProgressStepItemProps
}

export interface UseProgressStepOptions {
  readonly steps: readonly ProgressStepInput[]
}

export interface UseProgressStep {
  readonly steps: readonly ProgressStepItem[]
}

export function useProgressStep({ steps }: UseProgressStepOptions): UseProgressStep {
  return useMemo(
    () => ({
      steps: steps.map((step) => ({
        ...step,
        getItemProps: () => ({
          'aria-current': step.status === 'current' ? 'step' : undefined,
          'data-status': step.status,
        }),
      })),
    }),
    [steps],
  )
}
