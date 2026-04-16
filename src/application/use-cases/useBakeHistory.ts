export interface PastBake {
  readonly id: string
  readonly name: string
}

export interface UseBakeHistory {
  readonly bakes: readonly PastBake[]
  readonly isEmpty: boolean
}

export function useBakeHistory(): UseBakeHistory {
  const bakes: readonly PastBake[] = []
  return {
    bakes,
    isEmpty: bakes.length === 0,
  }
}
