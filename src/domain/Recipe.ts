export type YeastType = 'instant' | 'fresh'

const YEAST_PERCENTAGES: Record<YeastType, number> = {
  instant: 0.01,
  fresh: 0.03,
}

export function yeastPercentage(type: YeastType): number {
  return YEAST_PERCENTAGES[type]
}

export type RecipeInput = {
  finishedWeight: number
  loaves: number
  hydration: number
  salt: number
  yeast: number
  bakeOffLoss: number
}

export type IngredientRow = {
  name: string
  grams: number
  percentage: number
}

export type RecipeOutput = {
  ingredients: IngredientRow[]
  totalDoughWeight: number
  finishedWeightPerLoaf: number
}

export function calculateRecipe(input: RecipeInput): RecipeOutput {
  const targetDoughPerLoaf = input.finishedWeight / (1 - input.bakeOffLoss)
  const flour = targetDoughPerLoaf / (1 + input.hydration + input.salt)

  const water = flour * input.hydration
  const salt = flour * input.salt
  const yeast = flour * input.yeast

  const totalDoughPerLoaf = flour + water + salt + yeast

  const ingredients: IngredientRow[] = [
    { name: 'Flour', grams: Math.round(flour), percentage: 1 },
    { name: 'Water', grams: Math.round(water), percentage: input.hydration },
    { name: 'Salt', grams: Math.round(salt), percentage: input.salt },
    { name: 'Yeast', grams: Math.round(yeast), percentage: input.yeast },
  ]

  return {
    ingredients,
    totalDoughWeight: Math.round(totalDoughPerLoaf * input.loaves),
    finishedWeightPerLoaf: input.finishedWeight,
  }
}
