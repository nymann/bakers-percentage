export type HydrationPresetName = 'Classic' | 'Open crumb' | 'High hydration'

export type HydrationPreset = {
  name: HydrationPresetName
  percentage: number
}

export const HYDRATION_PRESETS: readonly HydrationPreset[] = [
  { name: 'Classic', percentage: 0.68 },
  { name: 'Open crumb', percentage: 0.75 },
  { name: 'High hydration', percentage: 0.82 },
] as const

export class PresetHydration {
  readonly mode = 'preset' as const
  readonly preset: HydrationPresetName

  constructor(preset: HydrationPresetName) {
    this.preset = preset
  }

  get percentage(): number {
    return HYDRATION_PRESETS.find((p) => p.name === this.preset)!.percentage
  }
}

export class CustomHydration {
  readonly mode = 'custom' as const
  readonly percentage: number

  constructor(percentage: number) {
    this.percentage = percentage
  }
}

export type HydrationSelection = PresetHydration | CustomHydration
