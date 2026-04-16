import { useCallback, useMemo, useState } from 'react'
import {
  Fermentation,
  createYeastFermentation,
  fermentationBoundaries,
  yeastFermentationBoundaries,
} from '../../domain/Fermentation'
import type { LeavingType } from '../../domain/SourdoughRecipe'
import type { YeastType } from '../../domain/Recipe'
import {
  FERMENTATION_DURATION_RANGE,
  type ClampResult,
} from '../../domain/InputRanges'

const DEFAULT_DURATION = 14

const INITIAL_CLAMP_NOTE: ClampResult = {
  value: DEFAULT_DURATION,
  clamped: false,
  range: FERMENTATION_DURATION_RANGE,
}

export interface YeastFermentationContext {
  leavingType: 'yeast'
  yeastType: YeastType
  salt: number
}

export interface SourdoughFermentationContext {
  leavingType: 'sourdough'
}

export type FermentationContext = YeastFermentationContext | SourdoughFermentationContext

const DEFAULT_CONTEXT: FermentationContext = { leavingType: 'sourdough' }

export function useFermentationZone(
  tempC: number,
  hydration: number,
  context: FermentationContext = DEFAULT_CONTEXT,
) {
  const [duration, setDuration] = useState(DEFAULT_DURATION)
  const [clampNote, setClampNote] = useState<ClampResult>(INITIAL_CLAMP_NOTE)

  const isYeast = context.leavingType === 'yeast'
  const yeastType: YeastType | null = isYeast ? context.yeastType : null
  const salt = isYeast ? context.salt : 0

  const strategy = useMemo(
    () =>
      isYeast && yeastType !== null
        ? createYeastFermentation(duration, tempC, yeastType, salt)
        : Fermentation.create(tempC, tempC, hydration, duration),
    [duration, tempC, hydration, isYeast, yeastType, salt],
  )

  const zone = strategy.zone
  const warning = strategy.warning

  const boundaries = useMemo(
    () =>
      isYeast
        ? yeastFermentationBoundaries(tempC)
        : fermentationBoundaries(tempC, hydration),
    [tempC, hydration, isYeast],
  )

  const changeFermentationDuration = useCallback((hours: number) => {
    const result = FERMENTATION_DURATION_RANGE.clamp(hours)
    setDuration(result.value)
    setClampNote(result)
  }, [])

  return { duration, zone, warning, boundaries, clampNote, changeFermentationDuration }
}

export function asLeavingTypeContext(
  leavingType: LeavingType,
  yeastType: YeastType,
  salt: number,
): FermentationContext {
  return leavingType === 'yeast'
    ? { leavingType: 'yeast', yeastType, salt }
    : { leavingType: 'sourdough' }
}
