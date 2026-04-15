import { useCallback, useMemo, useState } from 'react'
import {
  calculateRecipe,
  yeastPercentage,
  type YeastType,
} from '../../domain/Recipe'

const DEFAULTS = {
  finishedWeight: 800,
  loaves: 1,
  hydration: 0.75,
  salt: 0.02,
  bakeOffLoss: 0.13,
} as const

export function useRecipeCalculator() {
  const [finishedWeight, setFinishedWeight] = useState(DEFAULTS.finishedWeight)
  const [loaves, setLoaves] = useState(DEFAULTS.loaves)
  const [yeastType, setYeastType] = useState<YeastType>('instant')

  const recipe = useMemo(
    () =>
      calculateRecipe({
        ...DEFAULTS,
        finishedWeight,
        loaves,
        yeast: yeastPercentage(yeastType),
      }),
    [finishedWeight, loaves, yeastType],
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
