import { useCallback, useMemo, useState } from 'react'
import {
  calculateRecipe,
  yeastPercentage,
  type YeastType,
} from '../../domain/Recipe'

const DEFAULTS = {
  finishedWeight: 800,
  loaves: 1,
  salt: 0.02,
  bakeOffLoss: 0.13,
} as const

export function useRecipeCalculator() {
  const [finishedWeight, setFinishedWeight] = useState(DEFAULTS.finishedWeight)
  const [loaves, setLoaves] = useState(DEFAULTS.loaves)
  const [yeastType, setYeastType] = useState<YeastType>('instant')
  const [hydration, setHydration] = useState(0.75)

  const recipe = useMemo(
    () =>
      calculateRecipe({
        ...DEFAULTS,
        finishedWeight,
        loaves,
        hydration,
        yeast: yeastPercentage(yeastType),
      }),
    [finishedWeight, loaves, hydration, yeastType],
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

  return {
    recipe,
    loaves,
    yeastType,
    changeFinishedWeight,
    changeLoafCount,
    selectYeastType,
  }
}
