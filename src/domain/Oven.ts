export type OvenType = 'dutch-oven' | 'stone-steel' | 'sheet-pan'

export type OvenProfile = {
  readonly type: OvenType
  readonly label: string
  readonly tempRange: string
  readonly preheatRange: string
  readonly phaseGuidance: string
}

export const OVEN_PROFILES: readonly OvenProfile[] = [
  {
    type: 'dutch-oven',
    label: 'Dutch oven',
    tempRange: '230–260 °C',
    preheatRange: '30–45 min preheat',
    phaseGuidance: '20 min lid on, then 20 min lid off to finish the crust.',
  },
  {
    type: 'stone-steel',
    label: 'Stone or steel with steam',
    tempRange: '240–260 °C',
    preheatRange: '45–60 min preheat',
    phaseGuidance:
      'Steam the first 15 min (ice in a pan, lava rocks, or injection), then vent.',
  },
  {
    type: 'sheet-pan',
    label: 'Sheet pan, no steam',
    tempRange: '220–230 °C',
    preheatRange: '30 min preheat',
    phaseGuidance: 'Expect a thinner crust and less oven spring.',
  },
]

export function ovenProfileFor(type: OvenType): OvenProfile {
  const profile = OVEN_PROFILES.find((p) => p.type === type)
  if (!profile) throw new Error(`Unknown oven type: ${type}`)
  return profile
}
