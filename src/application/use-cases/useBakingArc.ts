export type ArcStepStatus = 'done' | 'current' | 'upcoming'

export interface ArcStep {
  readonly id: string
  readonly label: string
  readonly status: ArcStepStatus
}

export interface UseBakingArc {
  readonly steps: readonly ArcStep[]
}

export function useBakingArc(): UseBakingArc {
  return { steps: [] }
}
