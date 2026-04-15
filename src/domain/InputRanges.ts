export type ClampResult = {
  value: number
  clamped: boolean
  range: InputRange
}

export class InputRange {
  constructor(
    readonly min: number,
    readonly max: number,
    readonly unit: string,
  ) {}

  clamp(value: number): ClampResult {
    const clamped = Math.min(Math.max(value, this.min), this.max)
    return { value: clamped, clamped: clamped !== value, range: this }
  }
}

export const LOAVES_RANGE = new InputRange(1, 20, '')
export const FINISHED_WEIGHT_RANGE = new InputRange(100, 5000, 'g')
export const HYDRATION_RANGE = new InputRange(0.5, 1.0, '%')
export const SALT_RANGE = new InputRange(0, 0.05, '%')
export const BAKE_OFF_LOSS_RANGE = new InputRange(0.05, 0.25, '%')

export const STARTER_HYDRATION_RANGE = new InputRange(0.5, 2.0, '%')
export const DOUGH_TEMPERATURE_RANGE = new InputRange(15, 35, '°C')
export const FERMENTATION_DURATION_RANGE = new InputRange(1, 72, 'h')

export function starterPercentRange(hydration: number, starterHydration: number): InputRange {
  return new InputRange(0.01, Math.min(0.99, hydration / starterHydration), '%')
}
