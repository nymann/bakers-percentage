export type FermentationMethod = 'same-day' | 'cold-retard'

export type FermentationWindow = {
  totalHours: number
  doughTempC: number
  hydration: number
  starterHydration: number
}

export type StarterRecommendation = {
  method: FermentationMethod
  starterPercent: number
}

const BULK_HOURS_AT_REF = 3
const REF_TEMP = 24
const BULK_TEMP_SCALE = 3
const SAME_DAY_MAX_HOURS = 12

function bulkHours(tempC: number): number {
  return BULK_HOURS_AT_REF + (REF_TEMP - tempC) / BULK_TEMP_SCALE
}

export function hasColdPhase(window: FermentationWindow): boolean {
  return window.totalHours > SAME_DAY_MAX_HOURS
}

const A0 = 2.8777
const A1 = -0.1416
const A2 = 0.0339

const B0 = 1.6309
const B1 = 0.0511
const B2 = 0.0121

function sameDayStarterPercent(hours: number, tempC: number): number {
  const dt = tempC - REF_TEMP
  const a = A0 + A1 * dt + A2 * dt * dt
  const b = B0 + B1 * dt + B2 * dt * dt
  return a * Math.pow(hours, -b)
}

const COLD_COEFFICIENT = 0.3295
const COLD_EXPONENT = 0.5885

function coldRetardStarterPercent(totalHours: number, tempC: number): number {
  const coldHours = Math.max(1, totalHours - bulkHours(tempC))
  return COLD_COEFFICIENT * Math.pow(coldHours, -COLD_EXPONENT)
}

export function recommendStarterPercent(window: FermentationWindow): StarterRecommendation {
  if (hasColdPhase(window)) {
    return {
      method: 'cold-retard',
      starterPercent: coldRetardStarterPercent(window.totalHours, window.doughTempC),
    }
  }
  return {
    method: 'same-day',
    starterPercent: sameDayStarterPercent(window.totalHours, window.doughTempC),
  }
}
