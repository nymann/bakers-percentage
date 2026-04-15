import { useCallback, useMemo, useState } from 'react'
import {
  FermentationWindow,
  type FermentationMethod,
} from '../../domain/StarterRecommendation'

export function useStarterRecommendation(window: FermentationWindow) {
  const [percentOverride, setPercentOverride] = useState<number | null>(null)
  const [methodOverride, setMethodOverride] = useState<FermentationMethod | null>(null)

  const autoResult = useMemo(
    () => window.recommendStarterPercent(),
    [window.totalHours, window.doughTempC, window.hydration, window.starterHydration],
  )

  const effectiveMethod = methodOverride ?? autoResult.method

  const recommendation = useMemo(() => {
    if (methodOverride && methodOverride !== autoResult.method) {
      return window.recommendStarterPercent()
    }
    return autoResult
  }, [autoResult, methodOverride, window.totalHours, window.doughTempC, window.hydration, window.starterHydration])

  const recommendedPercent = useMemo(() => {
    if (methodOverride === null || methodOverride === autoResult.method) {
      return autoResult.starterPercent
    }
    if (methodOverride === 'same-day') {
      return window.withTotalHours(Math.min(window.totalHours, 12)).recommendStarterPercent().starterPercent
    }
    return window.withTotalHours(Math.max(window.totalHours, 13)).recommendStarterPercent().starterPercent
  }, [autoResult, methodOverride, window.totalHours, window.doughTempC, window.hydration, window.starterHydration])

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
    autoMethod: autoResult.method,
    effectiveMethod,
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
