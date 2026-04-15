export type FermentationZone = 'green' | 'yellow' | 'red'

export type FermentationResult = {
  zone: FermentationZone
  warning: string | null
}

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

export function determineFermentationZone(
  hours: number,
  tempC: number,
  hydration: number,
): FermentationResult {
  const factor = rateFactor(tempC) * hydrationFactor(hydration)

  const yellowLow = scaleBoundary(REF_YELLOW_LOW, factor)
  const greenLow = scaleBoundary(REF_GREEN_LOW, factor)
  const greenHigh = scaleBoundary(REF_GREEN_HIGH, factor)
  const yellowHigh = scaleBoundary(REF_YELLOW_HIGH, factor)

  if (hours >= greenLow && hours <= greenHigh) {
    return { zone: 'green', warning: null }
  }

  if (hours >= yellowLow && hours <= yellowHigh) {
    return { zone: 'yellow', warning: null }
  }

  const warning =
    hours < yellowLow
      ? 'Not feasible for sourdough'
      : 'Over-fermentation risk'

  return { zone: 'red', warning }
}
