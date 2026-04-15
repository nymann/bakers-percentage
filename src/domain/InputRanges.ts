export type InputRange = {
  readonly min: number
  readonly max: number
  readonly unit: string
}

export type ClampResult = {
  value: number
  clamped: boolean
  range: InputRange
}

export const LOAVES_RANGE: InputRange = { min: 1, max: 20, unit: '' }
export const FINISHED_WEIGHT_RANGE: InputRange = { min: 100, max: 5000, unit: 'g' }
export const HYDRATION_RANGE: InputRange = { min: 0.5, max: 1.0, unit: '%' }
export const SALT_RANGE: InputRange = { min: 0, max: 0.05, unit: '%' }
export const BAKE_OFF_LOSS_RANGE: InputRange = { min: 0.05, max: 0.25, unit: '%' }

export function clampToRange(value: number, range: InputRange): ClampResult {
  const clamped = Math.min(Math.max(value, range.min), range.max)
  return { value: clamped, clamped: clamped !== value, range }
}
