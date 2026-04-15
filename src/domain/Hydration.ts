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

export type HydrationSelection =
  | { mode: 'preset'; preset: HydrationPresetName }
  | { mode: 'custom'; percentage: number }

export function hydrationPercentage(selection: HydrationSelection): number {
  if (selection.mode === 'custom') return selection.percentage
  const preset = HYDRATION_PRESETS.find((p) => p.name === selection.preset)!
  return preset.percentage
}
