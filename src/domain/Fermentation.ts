import { SameDaySchedule, ColdRetardSchedule, type ScheduleEvent } from './BakingSchedule'

export type FermentationZone = 'green' | 'yellow' | 'red'
export type FermentationMethod = 'same-day' | 'cold-retard'

export interface FermentationStrategy {
  readonly method: FermentationMethod
  readonly inoculumPercent: number
  readonly zone: FermentationZone
  readonly warning: string | null
  schedule(bakeTime: Date): ScheduleEvent[]
}

const T_MIN = 5
const T_REF = 24
const REF_RATE = (T_REF - T_MIN) ** 2
const BULK_HOURS_AT_REF = 3
const BULK_TEMP_SCALE = 3

const REF_YELLOW_LOW = 4
const REF_GREEN_LOW = 6
const REF_GREEN_HIGH = 24
const REF_YELLOW_HIGH = 36

export function bulkHours(tempC: number): number {
  return BULK_HOURS_AT_REF + (T_REF - tempC) / BULK_TEMP_SCALE
}

function rateFactor(tempC: number): number {
  return ((tempC - T_MIN) ** 2) / REF_RATE
}

function hydrationFactor(hydration: number): number {
  return 1 + 0.5 * (hydration - 0.75)
}

function scaleBoundary(ref: number, factor: number): number {
  return Math.floor(ref / factor)
}

export type FermentationBoundaries = {
  readonly greenLow: number
  readonly greenHigh: number
  readonly yellowLow: number
  readonly yellowHigh: number
}

export function fermentationBoundaries(tempC: number, hydration: number): FermentationBoundaries {
  const factor = rateFactor(tempC) * hydrationFactor(hydration)
  return {
    greenLow: scaleBoundary(REF_GREEN_LOW, factor),
    greenHigh: scaleBoundary(REF_GREEN_HIGH, factor),
    yellowLow: scaleBoundary(REF_YELLOW_LOW, factor),
    yellowHigh: scaleBoundary(REF_YELLOW_HIGH, factor),
  }
}

function assessZone(hours: number, tempC: number, hydration: number): { zone: FermentationZone; warning: string | null } {
  const { greenLow, greenHigh, yellowLow, yellowHigh } = fermentationBoundaries(tempC, hydration)

  if (hours >= greenLow && hours <= greenHigh) return { zone: 'green', warning: null }
  if (hours >= yellowLow && hours <= yellowHigh) return { zone: 'yellow', warning: null }

  const warning = hours < yellowLow ? 'Not feasible for sourdough' : 'Over-fermentation risk'
  return { zone: 'red', warning }
}

const A0 = 2.8777
const A1 = -0.1416
const A2 = 0.0339
const B0 = 1.6309
const B1 = 0.0511
const B2 = 0.0121

export class RatkowskyFermentation implements FermentationStrategy {
  readonly method = 'same-day' as const
  readonly totalHours: number
  readonly tempC: number
  readonly hydration: number

  constructor(totalHours: number, tempC: number, hydration: number) {
    this.totalHours = totalHours
    this.tempC = tempC
    this.hydration = hydration
  }

  get inoculumPercent(): number {
    const dt = this.tempC - T_REF
    const a = A0 + A1 * dt + A2 * dt * dt
    const b = B0 + B1 * dt + B2 * dt * dt
    return a * Math.pow(this.totalHours, -b)
  }

  get zone(): FermentationZone {
    return assessZone(this.totalHours, this.tempC, this.hydration).zone
  }

  get warning(): string | null {
    return assessZone(this.totalHours, this.tempC, this.hydration).warning
  }

  schedule(bakeTime: Date): ScheduleEvent[] {
    return new SameDaySchedule(bakeTime, bulkHours(this.tempC)).events
  }
}

const COLD_COEFFICIENT = 0.3295
const COLD_EXPONENT = 0.5885

export class RetardFermentation implements FermentationStrategy {
  readonly method = 'cold-retard' as const
  readonly totalHours: number
  readonly doughTempC: number
  readonly hydration: number

  constructor(totalHours: number, doughTempC: number, hydration: number) {
    this.totalHours = totalHours
    this.doughTempC = doughTempC
    this.hydration = hydration
  }

  get inoculumPercent(): number {
    const coldHours = Math.max(1, this.totalHours - bulkHours(this.doughTempC))
    return COLD_COEFFICIENT * Math.pow(coldHours, -COLD_EXPONENT)
  }

  get zone(): FermentationZone {
    return assessZone(this.totalHours, this.doughTempC, this.hydration).zone
  }

  get warning(): string | null {
    return assessZone(this.totalHours, this.doughTempC, this.hydration).warning
  }

  schedule(bakeTime: Date): ScheduleEvent[] {
    return new ColdRetardSchedule(bakeTime, bulkHours(this.doughTempC), this.totalHours).events
  }
}

export const COLD_THRESHOLD = 8
export const FRIDGE_TEMP = 4

export class Fermentation {
  static create(fermentationTempC: number, doughTempC: number, hydration: number, totalHours: number): FermentationStrategy {
    if (fermentationTempC < COLD_THRESHOLD) {
      return new RetardFermentation(totalHours, doughTempC, hydration)
    }
    return new RatkowskyFermentation(totalHours, fermentationTempC, hydration)
  }
}
