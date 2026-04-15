import { useMemo } from 'react'
import { calculateRecipe, type RecipeOutput } from '../../domain/Recipe'

const DEFAULTS = {
  finishedWeight: 800,
  loaves: 1,
  hydration: 0.75,
  salt: 0.02,
  yeast: 0.01,
  bakeOffLoss: 0.13,
} as const

export function useRecipeCalculator(): RecipeOutput {
  return useMemo(() => calculateRecipe(DEFAULTS), [])
}
