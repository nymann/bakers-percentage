import type { HydrationPresetName } from './Hydration'
import type { OvenType } from './Oven'
import type { YeastType } from './Recipe'
import type { LeavingType } from './SourdoughRecipe'

export type SerializedHydrationSelection =
  | { readonly mode: 'preset'; readonly preset: HydrationPresetName }
  | { readonly mode: 'custom'; readonly percentage: number }

export type PlanningPreferences = {
  readonly leavingType: LeavingType
  readonly yeastType: YeastType
  readonly finishedWeight: number
  readonly loaves: number
  readonly hydrationSelection: SerializedHydrationSelection
  readonly salt: number
  readonly bakeOffLoss: number
  readonly starterPercent: number
  readonly starterHydration: number
  readonly doughTemperature: number
  readonly ovenType?: OvenType
  readonly preheatMinutes?: number
}

export const DEFAULT_PLANNING_PREFERENCES: PlanningPreferences = {
  leavingType: 'sourdough',
  yeastType: 'instant',
  finishedWeight: 900,
  loaves: 1,
  hydrationSelection: { mode: 'preset', preset: 'Open crumb' },
  salt: 0.02,
  bakeOffLoss: 0.13,
  starterPercent: 0.1,
  starterHydration: 1.0,
  doughTemperature: 24,
}
