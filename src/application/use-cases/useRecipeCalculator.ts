import { useCallback, useMemo, useState } from 'react'
import {
  calculateRecipe,
  yeastPercentage,
  type YeastType,
} from '../../domain/Recipe'
import {
  hydrationPercentage,
  type HydrationPresetName,
  type HydrationSelection,
} from '../../domain/Hydration'

const DEFAULTS = {
  finishedWeight: 800,
  loaves: 1,
  salt: 0.02,
  bakeOffLoss: 0.13,
}

export function useRecipeCalculator() {
  const [finishedWeight, setFinishedWeight] = useState(DEFAULTS.finishedWeight)
  const [loaves, setLoaves] = useState(DEFAULTS.loaves)
  const [yeastType, setYeastType] = useState<YeastType>('instant')
  const [hydrationSelection, setHydrationSelection] =
    useState<HydrationSelection>({ mode: 'preset', preset: 'Open crumb' })

  const recipe = useMemo(
    () =>
      calculateRecipe({
        ...DEFAULTS,
        finishedWeight,
        loaves,
        hydration: hydrationPercentage(hydrationSelection),
        yeast: yeastPercentage(yeastType),
      }),
    [finishedWeight, loaves, hydrationSelection, yeastType],
  )

  const changeFinishedWeight = useCallback(
    (grams: number) => setFinishedWeight(grams),
    [],
  )

  const changeLoafCount = useCallback(
    (count: number) => setLoaves(count),
    [],
  )

  const selectYeastType = useCallback(
    (type: YeastType) => setYeastType(type),
    [],
  )

  const selectHydrationPreset = useCallback(
    (name: HydrationPresetName) =>
      setHydrationSelection({ mode: 'preset', preset: name }),
    [],
  )

  const enterCustomHydration = useCallback(
    (percentage: number) =>
      setHydrationSelection({ mode: 'custom', percentage }),
    [],
  )

  const unlockCustomHydration = useCallback(
    () =>
      setHydrationSelection((current) => ({
        mode: 'custom',
        percentage: hydrationPercentage(current),
      })),
    [],
  )

  return {
    recipe,
    loaves,
    yeastType,
    hydrationSelection,
    changeFinishedWeight,
    changeLoafCount,
    selectYeastType,
    selectHydrationPreset,
    enterCustomHydration,
    unlockCustomHydration,
  }
}
