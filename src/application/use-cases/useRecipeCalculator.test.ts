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

  it('switches hydration to 68% when Classic preset selected', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.selectHydrationPreset('Classic'))

    const flour = result.current.recipe.ingredients.find(
      (i) => i.name === 'Flour',
    )!
    const water = result.current.recipe.ingredients.find(
      (i) => i.name === 'Water',
    )!
    expect(flour.grams).toBe(541)
    expect(water.grams).toBe(368)
    expect(result.current.hydrationSelection).toEqual({
      mode: 'preset',
      preset: 'Classic',
    })
  })

  it('enters custom hydration and deactivates presets', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.enterCustomHydration(0.7))

    const water = result.current.recipe.ingredients.find(
      (i) => i.name === 'Water',
    )!
    expect(water.grams).toBe(374)
    expect(result.current.hydrationSelection).toEqual({
      mode: 'custom',
      percentage: 0.7,
    })
  })

  it('unlocks custom hydration keeping current value', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.unlockCustomHydration())

    expect(result.current.hydrationSelection).toEqual({
      mode: 'custom',
      percentage: 0.75,
    })
    // Recipe unchanged since numeric value is the same
    const water = result.current.recipe.ingredients.find(
      (i) => i.name === 'Water',
    )!
    expect(water.grams).toBe(390)
  })

  it('returns to preset from custom mode', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.enterCustomHydration(0.71))
    expect(result.current.hydrationSelection).toEqual({
      mode: 'custom',
      percentage: 0.71,
    })

    act(() => result.current.selectHydrationPreset('Classic'))

    const water = result.current.recipe.ingredients.find(
      (i) => i.name === 'Water',
    )!
    expect(water.grams).toBe(368)
    expect(result.current.hydrationSelection).toEqual({
      mode: 'preset',
      preset: 'Classic',
    })
  })

  it('switches hydration to 82% when High hydration preset selected', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.selectHydrationPreset('High hydration'))

    const flour = result.current.recipe.ingredients.find(
      (i) => i.name === 'Flour',
    )!
    const water = result.current.recipe.ingredients.find(
      (i) => i.name === 'Water',
    )!
    expect(flour.grams).toBe(500)
    expect(water.grams).toBe(410)
    expect(result.current.hydrationSelection).toEqual({
      mode: 'preset',
      preset: 'High hydration',
    })
  })

  it('clamps loaf count below minimum to 1', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeLoafCount(0))

    expect(result.current.loaves).toBe(1)
    expect(result.current.clampNotes.loaves.clamped).toBe(true)
  })

  it('clamps loaf count above maximum to 20', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeLoafCount(25))

    expect(result.current.loaves).toBe(20)
    expect(result.current.clampNotes.loaves.clamped).toBe(true)
  })

  it('does not flag clamping for valid loaf count', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeLoafCount(5))

    expect(result.current.loaves).toBe(5)
    expect(result.current.clampNotes.loaves.clamped).toBe(false)
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
