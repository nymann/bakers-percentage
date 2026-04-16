import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  YeastRecipe,
  yeastPercentage,
  type YeastType,
} from '../../domain/Recipe'
import {
  SourdoughRecipe,
  type LeavingType,
} from '../../domain/SourdoughRecipe'
import {
  PresetHydration,
  CustomHydration,
  type HydrationPresetName,
  type HydrationSelection,
} from '../../domain/Hydration'
import {
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
import {
  DEFAULT_PLANNING_PREFERENCES,
  type PlanningPreferences,
  type SerializedHydrationSelection,
} from '../../domain/PlanningPreferences'

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

function clampNotesFor(prefs: PlanningPreferences): ClampNotes {
  return {
    loaves: { value: prefs.loaves, clamped: false, range: LOAVES_RANGE },
    finishedWeight: { value: prefs.finishedWeight, clamped: false, range: FINISHED_WEIGHT_RANGE },
    hydration: { value: prefs.hydrationSelection.mode === 'custom' ? prefs.hydrationSelection.percentage : 0.75, clamped: false, range: HYDRATION_RANGE },
    salt: { value: prefs.salt, clamped: false, range: SALT_RANGE },
    bakeOffLoss: { value: prefs.bakeOffLoss, clamped: false, range: BAKE_OFF_LOSS_RANGE },
    starterPercent: { value: prefs.starterPercent, clamped: false, range: starterPercentRange(prefs.hydrationSelection.mode === 'custom' ? prefs.hydrationSelection.percentage : 0.75, prefs.starterHydration) },
    starterHydration: { value: prefs.starterHydration, clamped: false, range: STARTER_HYDRATION_RANGE },
    doughTemperature: { value: prefs.doughTemperature, clamped: false, range: DOUGH_TEMPERATURE_RANGE },
  }
}

function materializeHydration(sel: SerializedHydrationSelection): HydrationSelection {
  return sel.mode === 'preset'
    ? new PresetHydration(sel.preset)
    : new CustomHydration(sel.percentage)
}

function serializeHydration(sel: HydrationSelection): SerializedHydrationSelection {
  return sel.mode === 'preset'
    ? { mode: 'preset', preset: sel.preset }
    : { mode: 'custom', percentage: sel.percentage }
}

export interface UseRecipeCalculatorOptions {
  readonly initial?: PlanningPreferences | null
  readonly onPreferencesChange?: (preferences: PlanningPreferences) => void
}

export function useRecipeCalculator(
  initialLeavening: LeavingType = 'yeast',
  options: UseRecipeCalculatorOptions = {},
) {
  const { initial, onPreferencesChange } = options
  const initialPrefs = useMemo<PlanningPreferences>(
    () => ({
      ...DEFAULT_PLANNING_PREFERENCES,
      leavingType: initialLeavening,
      ...(initial ?? {}),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once on mount
    [],
  )

  const [leavingType, setLeavingType] = useState<LeavingType>(initialPrefs.leavingType)
  const [finishedWeight, setFinishedWeight] = useState(initialPrefs.finishedWeight)
  const [loaves, setLoaves] = useState(initialPrefs.loaves)
  const [salt, setSalt] = useState(initialPrefs.salt)
  const [bakeOffLoss, setBakeOffLoss] = useState(initialPrefs.bakeOffLoss)
  const [yeastType, setYeastType] = useState<YeastType>(initialPrefs.yeastType)
  const [hydrationSelection, setHydrationSelection] =
    useState<HydrationSelection>(() => materializeHydration(initialPrefs.hydrationSelection))
  const [starterPercent, setStarterPercent] = useState(initialPrefs.starterPercent)
  const [starterHydration, setStarterHydration] = useState(initialPrefs.starterHydration)
  const [doughTemperature, setDoughTemperature] = useState(initialPrefs.doughTemperature)
  const [clampNotes, setClampNotes] = useState<ClampNotes>(() => clampNotesFor(initialPrefs))

  const hydration = hydrationSelection.percentage

  const recipe = useMemo(
    () =>
      leavingType === 'sourdough'
        ? new SourdoughRecipe(finishedWeight, loaves, hydration, salt, bakeOffLoss, starterPercent, starterHydration).calculate()
        : new YeastRecipe(finishedWeight, loaves, hydration, salt, yeastPercentage(yeastType), bakeOffLoss).calculate(),
    [finishedWeight, loaves, salt, bakeOffLoss, hydration, yeastType, leavingType, starterPercent, starterHydration],
  )

  const changeFinishedWeight = useCallback(
    (grams: number) => {
      const result = FINISHED_WEIGHT_RANGE.clamp(grams)
      setFinishedWeight(result.value)
      setClampNotes((prev) => ({ ...prev, finishedWeight: result }))
    },
    [],
  )

  const changeLoafCount = useCallback(
    (count: number) => {
      const result = LOAVES_RANGE.clamp(count)
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
      setHydrationSelection(new PresetHydration(name)),
    [],
  )

  const enterCustomHydration = useCallback(
    (percentage: number) => {
      const result = HYDRATION_RANGE.clamp(percentage)
      setHydrationSelection(new CustomHydration(result.value))
      setClampNotes((prev) => ({ ...prev, hydration: result }))
    },
    [],
  )

  const unlockCustomHydration = useCallback(
    () =>
      setHydrationSelection((current) =>
        new CustomHydration(current.percentage),
      ),
    [],
  )

  const changeSalt = useCallback(
    (percentage: number) => {
      const result = SALT_RANGE.clamp(percentage)
      setSalt(result.value)
      setClampNotes((prev) => ({ ...prev, salt: result }))
    },
    [],
  )

  const changeBakeOffLoss = useCallback(
    (percentage: number) => {
      const result = BAKE_OFF_LOSS_RANGE.clamp(percentage)
      setBakeOffLoss(result.value)
      setClampNotes((prev) => ({ ...prev, bakeOffLoss: result }))
    },
    [],
  )

  const selectLeavening = useCallback(
    (type: LeavingType) => {
      setLeavingType(type)
      if (type === 'sourdough') {
        setStarterPercent(DEFAULT_PLANNING_PREFERENCES.starterPercent)
        setStarterHydration(DEFAULT_PLANNING_PREFERENCES.starterHydration)
        setDoughTemperature(DEFAULT_PLANNING_PREFERENCES.doughTemperature)
        setClampNotes((prev) => ({
          ...prev,
          starterPercent: clampNotesFor(DEFAULT_PLANNING_PREFERENCES).starterPercent,
          starterHydration: clampNotesFor(DEFAULT_PLANNING_PREFERENCES).starterHydration,
          doughTemperature: clampNotesFor(DEFAULT_PLANNING_PREFERENCES).doughTemperature,
        }))
      }
    },
    [],
  )

  const changeStarterPercent = useCallback(
    (percentage: number) => {
      const range = starterPercentRange(hydration, starterHydration)
      const result = range.clamp(percentage)
      setStarterPercent(result.value)
      setClampNotes((prev) => ({ ...prev, starterPercent: result }))
    },
    [hydration, starterHydration],
  )

  const changeStarterHydration = useCallback(
    (percentage: number) => {
      const result = STARTER_HYDRATION_RANGE.clamp(percentage)
      setStarterHydration(result.value)
      setClampNotes((prev) => ({ ...prev, starterHydration: result }))
    },
    [],
  )

  const changeDoughTemperature = useCallback(
    (temp: number) => {
      const result = DOUGH_TEMPERATURE_RANGE.clamp(temp)
      setDoughTemperature(result.value)
      setClampNotes((prev) => ({ ...prev, doughTemperature: result }))
    },
    [],
  )

  const applyPreferences = useCallback((prefs: PlanningPreferences) => {
    setLeavingType(prefs.leavingType)
    setYeastType(prefs.yeastType)
    setFinishedWeight(prefs.finishedWeight)
    setLoaves(prefs.loaves)
    setHydrationSelection(materializeHydration(prefs.hydrationSelection))
    setSalt(prefs.salt)
    setBakeOffLoss(prefs.bakeOffLoss)
    setStarterPercent(prefs.starterPercent)
    setStarterHydration(prefs.starterHydration)
    setDoughTemperature(prefs.doughTemperature)
    setClampNotes(clampNotesFor(prefs))
  }, [])

  const preferences = useMemo<PlanningPreferences>(
    () => ({
      leavingType,
      yeastType,
      finishedWeight,
      loaves,
      hydrationSelection: serializeHydration(hydrationSelection),
      salt,
      bakeOffLoss,
      starterPercent,
      starterHydration,
      doughTemperature,
    }),
    [
      leavingType,
      yeastType,
      finishedWeight,
      loaves,
      hydrationSelection,
      salt,
      bakeOffLoss,
      starterPercent,
      starterHydration,
      doughTemperature,
    ],
  )

  useEffect(() => {
    onPreferencesChange?.(preferences)
  }, [preferences, onPreferencesChange])

  return {
    recipe,
    hydration,
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
    preferences,
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
    applyPreferences,
  }
}
