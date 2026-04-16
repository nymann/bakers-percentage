import { useCallback, useMemo, useState } from 'react'
import {
  Fermentation,
  FRIDGE_TEMP,
  type FermentationMethod,
} from '../../domain/Fermentation'

const SAME_DAY_MAX_HOURS = 12

export function useStarterRecommendation(
  doughTempC: number,
  hydration: number,
  totalHours: number,
) {
  const [percentOverride, setPercentOverride] = useState<number | null>(null)
  const [methodOverride, setMethodOverride] = useState<FermentationMethod | null>(null)

  const autoFermentationTemp = totalHours > SAME_DAY_MAX_HOURS ? FRIDGE_TEMP : doughTempC

  const autoStrategy = useMemo(
    () => Fermentation.create(autoFermentationTemp, doughTempC, hydration, totalHours),
    [autoFermentationTemp, doughTempC, hydration, totalHours],
  )

  const effectiveMethod = methodOverride ?? autoStrategy.method

  const effectiveFermentationTemp = effectiveMethod === 'cold-retard' ? FRIDGE_TEMP : doughTempC

  const effectiveStrategy = useMemo(
    () => Fermentation.create(effectiveFermentationTemp, doughTempC, hydration, totalHours),
    [effectiveFermentationTemp, doughTempC, hydration, totalHours],
  )

  const recommendedPercent = effectiveStrategy.starterPercent
  const isOverridden = percentOverride !== null
  const isMethodOverridden = methodOverride !== null
  const hasAnyOverride = isOverridden || isMethodOverridden
  const effectivePercent = percentOverride ?? recommendedPercent

  const overrideStarterPercent = useCallback((percent: number) => {
    setPercentOverride(percent)
  }, [])

  const overrideMethod = useCallback((method: FermentationMethod) => {
    setMethodOverride(method)
    setPercentOverride(null)
  }, [])

  const useRecommended = useCallback(() => {
    setPercentOverride(null)
    setMethodOverride(null)
  }, [])

  return {
    autoMethod: autoStrategy.method,
    effectiveMethod,
    effectiveStrategy,
    recommendedPercent,
    effectivePercent,
    isOverridden,
    isMethodOverridden,
    hasAnyOverride,
    overrideStarterPercent,
    overrideMethod,
    useRecommended,
  }
}
