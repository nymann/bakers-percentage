import { describe, it, expect } from 'vitest'
import { calculateRecipe } from './Recipe'

describe('calculateRecipe', () => {
  const defaults = {
    finishedWeight: 800,
    loaves: 1,
    hydration: 0.75,
    salt: 0.02,
    yeast: 0.01,
    bakeOffLoss: 0.13,
  }

  it('produces correct ingredient weights for walking skeleton defaults', () => {
    const result = calculateRecipe(defaults)

    const byName = (name: string) =>
      result.ingredients.find((i) => i.name === name)!

    expect(byName('Flour').grams).toBe(520)
    expect(byName('Water').grams).toBe(390)
    expect(byName('Salt').grams).toBe(10)
    expect(byName('Yeast').grams).toBe(5)
  })

  it('reports total dough weight of approximately 925g', () => {
    const result = calculateRecipe(defaults)
    expect(result.totalDoughWeight).toBeGreaterThanOrEqual(920)
    expect(result.totalDoughWeight).toBeLessThanOrEqual(930)
  })

  it('reports finished weight per loaf', () => {
    const result = calculateRecipe(defaults)
    expect(result.finishedWeightPerLoaf).toBe(800)
  })
})
