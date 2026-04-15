export type FermentationZone = 'green' | 'yellow' | 'red'

const T_MIN = 5
const T_REF = 24
const REF_RATE = (T_REF - T_MIN) ** 2

const REF_YELLOW_LOW = 4
const REF_GREEN_LOW = 6
const REF_GREEN_HIGH = 24
const REF_YELLOW_HIGH = 36

function rateFactor(tempC: number): number {
  return ((tempC - T_MIN) ** 2) / REF_RATE
}

function hydrationFactor(hydration: number): number {
  return 1 + 0.5 * (hydration - 0.75)
}

function scaleBoundary(ref: number, factor: number): number {
  return Math.floor(ref / factor)
}

export class FermentationAssessment {
  constructor(
    readonly hours: number,
    readonly tempC: number,
    readonly hydration: number,
  ) {}

  get zone(): FermentationZone {
    const factor = rateFactor(this.tempC) * hydrationFactor(this.hydration)
    const greenLow = scaleBoundary(REF_GREEN_LOW, factor)
    const greenHigh = scaleBoundary(REF_GREEN_HIGH, factor)
    const yellowLow = scaleBoundary(REF_YELLOW_LOW, factor)
    const yellowHigh = scaleBoundary(REF_YELLOW_HIGH, factor)

    if (this.hours >= greenLow && this.hours <= greenHigh) return 'green'
    if (this.hours >= yellowLow && this.hours <= yellowHigh) return 'yellow'
    return 'red'
  }

  get warning(): string | null {
    if (this.zone !== 'red') return null
    const factor = rateFactor(this.tempC) * hydrationFactor(this.hydration)
    const yellowLow = scaleBoundary(REF_YELLOW_LOW, factor)
    return this.hours < yellowLow
      ? 'Not feasible for sourdough'
      : 'Over-fermentation risk'
  }
}
