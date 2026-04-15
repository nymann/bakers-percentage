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
import {
  clampToRange,
  LOAVES_RANGE,
  FINISHED_WEIGHT_RANGE,
  HYDRATION_RANGE,
  type ClampResult,
} from '../../domain/InputRanges'

const DEFAULTS = {
  finishedWeight: 800,
  loaves: 1,
  salt: 0.02,
  bakeOffLoss: 0.13,
}

type ClampNotes = {
  loaves: ClampResult
  finishedWeight: ClampResult
  hydration: ClampResult
}

const INITIAL_CLAMP_NOTES: ClampNotes = {
  loaves: { value: DEFAULTS.loaves, clamped: false, range: LOAVES_RANGE },
  finishedWeight: { value: DEFAULTS.finishedWeight, clamped: false, range: FINISHED_WEIGHT_RANGE },
  hydration: { value: 0.75, clamped: false, range: HYDRATION_RANGE },
}

export function useRecipeCalculator() {
  const [finishedWeight, setFinishedWeight] = useState(DEFAULTS.finishedWeight)
  const [loaves, setLoaves] = useState(DEFAULTS.loaves)
  const [yeastType, setYeastType] = useState<YeastType>('instant')
  const [hydrationSelection, setHydrationSelection] =
    useState<HydrationSelection>({ mode: 'preset', preset: 'Open crumb' })
  const [clampNotes, setClampNotes] = useState<ClampNotes>(INITIAL_CLAMP_NOTES)

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
    (grams: number) => {
      const result = clampToRange(grams, FINISHED_WEIGHT_RANGE)
      setFinishedWeight(result.value)
      setClampNotes((prev) => ({ ...prev, finishedWeight: result }))
    },
    [],
  )

  const changeLoafCount = useCallback(
    (count: number) => {
      const result = clampToRange(count, LOAVES_RANGE)
      setLoaves(result.value)
      setClampNotes((prev) => ({ ...prev, loaves: result }))
    },
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
    (percentage: number) => {
      const result = clampToRange(percentage, HYDRATION_RANGE)
      setHydrationSelection({ mode: 'custom', percentage: result.value })
      setClampNotes((prev) => ({ ...prev, hydration: result }))
    },
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
    clampNotes,
    changeFinishedWeight,
    changeLoafCount,
    selectYeastType,
    selectHydrationPreset,
    enterCustomHydration,
    unlockCustomHydration,
  }
}
