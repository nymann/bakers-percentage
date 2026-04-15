import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecipeCalculator } from './useRecipeCalculator'

describe('useRecipeCalculator', () => {
  it('returns default recipe on initial render', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    const flour = result.current.recipe.ingredients.find(
      (i) => i.name === 'Flour',
    )!
    expect(flour.grams).toBe(520)
    expect(result.current.recipe.finishedWeightPerLoaf).toBe(800)
  })

  it('doubles total dough weight when loaf count changes to 2', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeLoafCount(2))

    const flour = result.current.recipe.ingredients.find(
      (i) => i.name === 'Flour',
    )!
    expect(flour.grams).toBe(520) // per-loaf unchanged
    expect(result.current.recipe.totalDoughWeight).toBe(1849)
    expect(result.current.recipe.finishedWeightPerLoaf).toBe(800)
  })

  it('triples yeast grams when selecting fresh yeast', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    const yeastBefore = result.current.recipe.ingredients.find(
      (i) => i.name === 'Yeast',
    )!
    expect(yeastBefore.grams).toBe(5) // instant default

    act(() => result.current.selectYeastType('fresh'))

    const yeastAfter = result.current.recipe.ingredients.find(
      (i) => i.name === 'Yeast',
    )!
    expect(yeastAfter.grams).toBe(16) // 520 * 0.03 ≈ 16
    expect(yeastAfter.percentage).toBe(0.03)
  })

  it('recalculates when finished weight changes', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeFinishedWeight(1000))

    const flour = result.current.recipe.ingredients.find(
      (i) => i.name === 'Flour',
    )!
    expect(flour.grams).toBe(649)
    expect(flour.percentage).toBe(1) // baker's % unchanged
    expect(result.current.recipe.finishedWeightPerLoaf).toBe(1000)
  })
})
