import { useCallback, useMemo, useState } from 'react'
import {
  calculateRecipe,
  yeastPercentage,
  type YeastType,
} from '../../domain/Recipe'
import {
  calculateSourdoughRecipe,
  type LeavingType,
} from '../../domain/SourdoughRecipe'
import {
  hydrationPercentage,
  type HydrationPresetName,
  type HydrationSelection,
} from '../../domain/Hydration'
import {
  clampToRange,
  starterPercentRange,
  LOAVES_RANGE,
  FINISHED_WEIGHT_RANGE,
  HYDRATION_RANGE,
  SALT_RANGE,
  BAKE_OFF_LOSS_RANGE,
  STARTER_HYDRATION_RANGE,
  DOUGH_TEMPERATURE_RANGE,
  type ClampResult,
} from '../../domain/InputRanges'

const DEFAULTS = {
  finishedWeight: 800,
  loaves: 1,
  salt: 0.02,
  bakeOffLoss: 0.13,
  starterPercent: 0.1,
  starterHydration: 1.0,
  doughTemperature: 24,
}

type ClampNotes = {
  loaves: ClampResult
  finishedWeight: ClampResult
  hydration: ClampResult
  salt: ClampResult
  bakeOffLoss: ClampResult
  starterPercent: ClampResult
  starterHydration: ClampResult
  doughTemperature: ClampResult
}

const INITIAL_STARTER_PERCENT_RANGE = starterPercentRange(0.75, DEFAULTS.starterHydration)

const INITIAL_CLAMP_NOTES: ClampNotes = {
  loaves: { value: DEFAULTS.loaves, clamped: false, range: LOAVES_RANGE },
  finishedWeight: { value: DEFAULTS.finishedWeight, clamped: false, range: FINISHED_WEIGHT_RANGE },
  hydration: { value: 0.75, clamped: false, range: HYDRATION_RANGE },
  salt: { value: DEFAULTS.salt, clamped: false, range: SALT_RANGE },
  bakeOffLoss: { value: DEFAULTS.bakeOffLoss, clamped: false, range: BAKE_OFF_LOSS_RANGE },
  starterPercent: { value: DEFAULTS.starterPercent, clamped: false, range: INITIAL_STARTER_PERCENT_RANGE },
  starterHydration: { value: DEFAULTS.starterHydration, clamped: false, range: STARTER_HYDRATION_RANGE },
  doughTemperature: { value: DEFAULTS.doughTemperature, clamped: false, range: DOUGH_TEMPERATURE_RANGE },
}

export function useRecipeCalculator(initialLeavening: LeavingType = 'yeast') {
  const [leavingType, setLeavingType] = useState<LeavingType>(initialLeavening)
  const [finishedWeight, setFinishedWeight] = useState(DEFAULTS.finishedWeight)
  const [loaves, setLoaves] = useState(DEFAULTS.loaves)
  const [salt, setSalt] = useState(DEFAULTS.salt)
  const [bakeOffLoss, setBakeOffLoss] = useState(DEFAULTS.bakeOffLoss)
  const [yeastType, setYeastType] = useState<YeastType>('instant')
  const [hydrationSelection, setHydrationSelection] =
    useState<HydrationSelection>({ mode: 'preset', preset: 'Open crumb' })
  const [starterPercent, setStarterPercent] = useState(DEFAULTS.starterPercent)
  const [starterHydration, setStarterHydration] = useState(DEFAULTS.starterHydration)
  const [doughTemperature, setDoughTemperature] = useState(DEFAULTS.doughTemperature)
  const [clampNotes, setClampNotes] = useState<ClampNotes>(INITIAL_CLAMP_NOTES)

  const hydration = hydrationPercentage(hydrationSelection)

  const recipe = useMemo(
    () =>
      leavingType === 'sourdough'
        ? calculateSourdoughRecipe({
            finishedWeight,
            loaves,
            salt,
            bakeOffLoss,
            hydration,
            starterPercent,
            starterHydration,
          })
        : calculateRecipe({
            finishedWeight,
            loaves,
            salt,
            bakeOffLoss,
            hydration,
            yeast: yeastPercentage(yeastType),
          }),
    [finishedWeight, loaves, salt, bakeOffLoss, hydration, yeastType, leavingType, starterPercent, starterHydration],
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

  const changeSalt = useCallback(
    (percentage: number) => {
      const result = clampToRange(percentage, SALT_RANGE)
      setSalt(result.value)
      setClampNotes((prev) => ({ ...prev, salt: result }))
    },
    [],
  )

  const changeBakeOffLoss = useCallback(
    (percentage: number) => {
      const result = clampToRange(percentage, BAKE_OFF_LOSS_RANGE)
      setBakeOffLoss(result.value)
      setClampNotes((prev) => ({ ...prev, bakeOffLoss: result }))
    },
    [],
  )

  const selectLeavening = useCallback(
    (type: LeavingType) => setLeavingType(type),
    [],
  )

  const changeStarterPercent = useCallback(
    (percentage: number) => {
      const range = starterPercentRange(hydration, starterHydration)
      const result = clampToRange(percentage, range)
      setStarterPercent(result.value)
      setClampNotes((prev) => ({ ...prev, starterPercent: result }))
    },
    [hydration, starterHydration],
  )

  const changeStarterHydration = useCallback(
    (percentage: number) => {
      const result = clampToRange(percentage, STARTER_HYDRATION_RANGE)
      setStarterHydration(result.value)
      setClampNotes((prev) => ({ ...prev, starterHydration: result }))
    },
    [],
  )

  const changeDoughTemperature = useCallback(
    (temp: number) => {
      const result = clampToRange(temp, DOUGH_TEMPERATURE_RANGE)
      setDoughTemperature(result.value)
      setClampNotes((prev) => ({ ...prev, doughTemperature: result }))
    },
    [],
  )

  return {
    recipe,
    loaves,
    salt,
    bakeOffLoss,
    yeastType,
    leavingType,
    starterPercent,
    starterHydration,
    doughTemperature,
    hydrationSelection,
    clampNotes,
    changeFinishedWeight,
    changeLoafCount,
    changeSalt,
    changeBakeOffLoss,
    selectYeastType,
    selectHydrationPreset,
    enterCustomHydration,
    unlockCustomHydration,
    selectLeavening,
    changeStarterPercent,
    changeStarterHydration,
    changeDoughTemperature,
  }
}
