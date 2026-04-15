import { describe, it, expect } from 'vitest'
import { YeastRecipe, yeastPercentage } from '../../src/domain/Recipe'

describe('YeastRecipe', () => {
  const recipe = new YeastRecipe(800, 1, 0.75, 0.02, 0.01, 0.13)

  it('produces correct ingredient weights for walking skeleton defaults', () => {
    const result = recipe.calculate()

    const byName = (name: string) =>
      result.ingredients.find((i) => i.name === name)!

    expect(byName('Flour').grams).toBe(520)
    expect(byName('Water').grams).toBe(390)
    expect(byName('Salt').grams).toBe(10)
    expect(byName('Yeast').grams).toBe(5)
  })

  it('reports total dough weight of approximately 925g', () => {
    const result = recipe.calculate()
    expect(result.totalDoughWeight).toBeGreaterThanOrEqual(920)
    expect(result.totalDoughWeight).toBeLessThanOrEqual(930)
  })

  it('reports finished weight per loaf', () => {
    const result = recipe.calculate()
    expect(result.finishedWeightPerLoaf).toBe(800)
  })
})

describe('yeastPercentage', () => {
  it('returns 1% for instant yeast', () => {
    expect(yeastPercentage('instant')).toBe(0.01)
  })

  it('returns 3% for fresh yeast', () => {
    expect(yeastPercentage('fresh')).toBe(0.03)
  })
})
