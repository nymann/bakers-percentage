import type { IngredientRow, RecipeCalculation, RecipeOutput } from './Recipe'

export type LeavingType = 'sourdough' | 'yeast'

export class SourdoughRecipe implements RecipeCalculation {
  constructor(
    readonly finishedWeight: number,
    readonly loaves: number,
    readonly hydration: number,
    readonly salt: number,
    readonly bakeOffLoss: number,
    readonly starterPercent: number,
    readonly starterHydration: number,
  ) {}

  calculate(): RecipeOutput {
    const targetDoughPerLoaf = this.finishedWeight / (1 - this.bakeOffLoss)
    const totalFlour = targetDoughPerLoaf / (1 + this.hydration + this.salt)

    const starterFlour = totalFlour * this.starterPercent
    const baseFlour = totalFlour - starterFlour
    const starterWater = starterFlour * this.starterHydration
    const additionalWater = totalFlour * this.hydration - starterWater
    const salt = totalFlour * this.salt
    const starterWeight = starterFlour + starterWater

    const totalDoughPerLoaf = baseFlour + additionalWater + salt + starterWeight

    const ingredients: IngredientRow[] = [
      { name: 'Base flour', grams: Math.round(baseFlour), percentage: 1 - this.starterPercent },
      { name: 'Water', grams: Math.round(additionalWater), percentage: this.hydration },
      { name: 'Salt', grams: Math.round(salt), percentage: this.salt },
      { name: 'Starter', grams: Math.round(starterWeight), percentage: this.starterPercent },
    ]

    return {
      ingredients,
      totalDoughWeight: Math.round(totalDoughPerLoaf * this.loaves),
      finishedWeightPerLoaf: this.finishedWeight,
    }
  }
}
