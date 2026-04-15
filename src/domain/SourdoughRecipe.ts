import type { IngredientRow, RecipeOutput } from './Recipe'

export type LeavingType = 'sourdough' | 'yeast'

export type SourdoughRecipeInput = {
  finishedWeight: number
  loaves: number
  hydration: number
  salt: number
  bakeOffLoss: number
  starterPercent: number
  starterHydration: number
}

export function calculateSourdoughRecipe(input: SourdoughRecipeInput): RecipeOutput {
  const targetDoughPerLoaf = input.finishedWeight / (1 - input.bakeOffLoss)
  const totalFlour = targetDoughPerLoaf / (1 + input.hydration + input.salt)

  const starterFlour = totalFlour * input.starterPercent
  const baseFlour = totalFlour - starterFlour
  const starterWater = starterFlour * input.starterHydration
  const additionalWater = totalFlour * input.hydration - starterWater
  const salt = totalFlour * input.salt
  const starterWeight = starterFlour + starterWater

  const totalDoughPerLoaf = baseFlour + additionalWater + salt + starterWeight

  const ingredients: IngredientRow[] = [
    { name: 'Base flour', grams: Math.round(baseFlour), percentage: 1 - input.starterPercent },
    { name: 'Water', grams: Math.round(additionalWater), percentage: input.hydration },
    { name: 'Salt', grams: Math.round(salt), percentage: input.salt },
    { name: 'Starter', grams: Math.round(starterWeight), percentage: input.starterPercent },
  ]

  return {
    ingredients,
    totalDoughWeight: Math.round(totalDoughPerLoaf * input.loaves),
    finishedWeightPerLoaf: input.finishedWeight,
  }
}
