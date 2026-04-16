export type YeastType = 'instant' | 'fresh'

const YEAST_PERCENTAGES: Record<YeastType, number> = {
  instant: 0.01,
  fresh: 0.03,
}

export function yeastPercentage(type: YeastType): number {
  return YEAST_PERCENTAGES[type]
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

export interface RecipeCalculation {
  calculate(): RecipeOutput
}

export class YeastRecipe implements RecipeCalculation {
  readonly finishedWeight: number
  readonly loaves: number
  readonly hydration: number
  readonly salt: number
  readonly yeast: number
  readonly bakeOffLoss: number

  constructor(
    finishedWeight: number,
    loaves: number,
    hydration: number,
    salt: number,
    yeast: number,
    bakeOffLoss: number,
  ) {
    this.finishedWeight = finishedWeight
    this.loaves = loaves
    this.hydration = hydration
    this.salt = salt
    this.yeast = yeast
    this.bakeOffLoss = bakeOffLoss
  }

  calculate(): RecipeOutput {
    const targetDoughPerLoaf = this.finishedWeight / (1 - this.bakeOffLoss)
    const flour = targetDoughPerLoaf / (1 + this.hydration + this.salt)

    const water = flour * this.hydration
    const salt = flour * this.salt
    const yeast = flour * this.yeast

    const totalDoughPerLoaf = flour + water + salt + yeast

    const ingredients: IngredientRow[] = [
      { name: 'Flour', grams: Math.round(flour), percentage: 1 },
      { name: 'Water', grams: Math.round(water), percentage: this.hydration },
      { name: 'Salt', grams: Math.round(salt), percentage: this.salt },
      { name: 'Yeast', grams: Math.round(yeast), percentage: this.yeast },
    ]

    return {
      ingredients,
      totalDoughWeight: Math.round(totalDoughPerLoaf * this.loaves),
      finishedWeightPerLoaf: this.finishedWeight,
    }
  }
}
