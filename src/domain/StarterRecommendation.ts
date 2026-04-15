export type FermentationMethod = 'same-day' | 'cold-retard'

export type StarterRecommendation = {
  method: FermentationMethod
  starterPercent: number
}

const BULK_HOURS_AT_REF = 3
const REF_TEMP = 24
const BULK_TEMP_SCALE = 3
const SAME_DAY_MAX_HOURS = 12

export function bulkHours(tempC: number): number {
  return BULK_HOURS_AT_REF + (REF_TEMP - tempC) / BULK_TEMP_SCALE
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

export class FermentationWindow {
  constructor(
    readonly totalHours: number,
    readonly doughTempC: number,
    readonly hydration: number,
    readonly starterHydration: number,
  ) {}

  get hasColdPhase(): boolean {
    return this.totalHours > SAME_DAY_MAX_HOURS
  }

  withTotalHours(hours: number): FermentationWindow {
    return new FermentationWindow(hours, this.doughTempC, this.hydration, this.starterHydration)
  }

  recommendStarterPercent(): StarterRecommendation {
    if (this.hasColdPhase) {
      return {
        method: 'cold-retard',
        starterPercent: coldRetardStarterPercent(this.totalHours, this.doughTempC),
      }
    }
    return {
      method: 'same-day',
      starterPercent: sameDayStarterPercent(this.totalHours, this.doughTempC),
    }
  }
}
