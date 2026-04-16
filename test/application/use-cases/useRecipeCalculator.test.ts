import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecipeCalculator } from '../../../src/application/use-cases/useRecipeCalculator'

describe('useRecipeCalculator', () => {
  it('returns default recipe on initial render', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    const flour = result.current.recipe.ingredients.find(
      (i) => i.name === 'Flour',
    )!
    expect(flour.grams).toBe(584)
    expect(result.current.recipe.finishedWeightPerLoaf).toBe(900)
  })

  it('doubles total dough weight when loaf count changes to 2', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeLoafCount(2))

    const flour = result.current.recipe.ingredients.find(
      (i) => i.name === 'Flour',
    )!
    expect(flour.grams).toBe(584) // per-loaf unchanged
    expect(result.current.recipe.totalDoughWeight).toBe(2081)
    expect(result.current.recipe.finishedWeightPerLoaf).toBe(900)
  })

  it('triples yeast grams when selecting fresh yeast', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    const yeastBefore = result.current.recipe.ingredients.find(
      (i) => i.name === 'Yeast',
    )!
    expect(yeastBefore.grams).toBe(6) // instant default

    act(() => result.current.selectYeastType('fresh'))

    const yeastAfter = result.current.recipe.ingredients.find(
      (i) => i.name === 'Yeast',
    )!
    expect(yeastAfter.grams).toBe(18) // 584 * 0.03 ≈ 18
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
    expect(flour.grams).toBe(609)
    expect(water.grams).toBe(414)
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
    expect(water.grams).toBe(421)
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
    expect(water.grams).toBe(438)
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
    expect(water.grams).toBe(414)
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
    expect(flour.grams).toBe(562)
    expect(water.grams).toBe(461)
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

  it('clamps salt below minimum to 0', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeSalt(-0.01))

    expect(result.current.clampNotes.salt.value).toBe(0)
    expect(result.current.clampNotes.salt.clamped).toBe(true)
  })

  it('clamps salt above maximum to 5%', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeSalt(0.08))

    expect(result.current.clampNotes.salt.value).toBe(0.05)
    expect(result.current.clampNotes.salt.clamped).toBe(true)
  })

  it('starts with yeast leavening by default', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    expect(result.current.leavingType).toBe('yeast')
  })

  it('starts with sourdough when initialLeavening is sourdough', () => {
    const { result } = renderHook(() => useRecipeCalculator('sourdough'))

    expect(result.current.leavingType).toBe('sourdough')
    expect(result.current.starterPercent).toBe(0.1)
    expect(result.current.starterHydration).toBe(1.0)
    expect(result.current.doughTemperature).toBe(24)
  })

  it('switches to sourdough leavening and exposes starter defaults', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.selectLeavening('sourdough'))

    expect(result.current.leavingType).toBe('sourdough')
    expect(result.current.starterPercent).toBe(0.1)
    expect(result.current.starterHydration).toBe(1.0)
    expect(result.current.doughTemperature).toBe(24)
  })

  it('switches back to yeast from sourdough', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.selectLeavening('sourdough'))
    act(() => result.current.selectLeavening('yeast'))

    expect(result.current.leavingType).toBe('yeast')
  })

  it('resets sourdough values to defaults when switching back to sourdough', () => {
    const { result } = renderHook(() => useRecipeCalculator('sourdough'))

    act(() => result.current.changeStarterPercent(0.3))
    act(() => result.current.changeStarterHydration(0.8))
    act(() => result.current.changeDoughTemperature(30))

    expect(result.current.starterPercent).toBe(0.3)

    act(() => result.current.selectLeavening('yeast'))
    act(() => result.current.selectLeavening('sourdough'))

    expect(result.current.starterPercent).toBe(0.1)
    expect(result.current.starterHydration).toBe(1.0)
    expect(result.current.doughTemperature).toBe(24)
    expect(result.current.clampNotes.starterPercent.clamped).toBe(false)
    expect(result.current.clampNotes.starterHydration.clamped).toBe(false)
    expect(result.current.clampNotes.doughTemperature.clamped).toBe(false)
  })

  it('calculates sourdough recipe with split flour and water', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.selectLeavening('sourdough'))
    act(() => result.current.changeStarterPercent(0.2))

    const byName = (name: string) =>
      result.current.recipe.ingredients.find((i) => i.name === name)!

    expect(byName('Base flour').grams).toBe(468)
    expect(byName('Base flour').percentage).toBeCloseTo(0.8)
    expect(byName('Water').grams).toBe(321)
    expect(byName('Water').percentage).toBeCloseTo(0.75)
    expect(byName('Salt').grams).toBe(12)
    expect(byName('Starter').grams).toBe(234)
    expect(byName('Starter').percentage).toBeCloseTo(0.2)
  })

  it('sourdough total dough weight is unchanged by starter percent', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.selectLeavening('sourdough'))
    const totalWith10 = result.current.recipe.totalDoughWeight

    act(() => result.current.changeStarterPercent(0.2))
    const totalWith20 = result.current.recipe.totalDoughWeight

    expect(totalWith20).toBe(totalWith10)
  })

  it('clamps starter percent to max safe value for positive base flour', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.selectLeavening('sourdough'))
    // Default hydration 75%, starter hydration 100% → max = 0.75
    act(() => result.current.changeStarterPercent(1.0))

    expect(result.current.starterPercent).toBe(0.75)
    expect(result.current.clampNotes.starterPercent.clamped).toBe(true)
  })

  it('clamps starter hydration below minimum to 50%', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeStarterHydration(0.3))

    expect(result.current.starterHydration).toBe(0.5)
    expect(result.current.clampNotes.starterHydration.clamped).toBe(true)
  })

  it('clamps starter hydration above maximum to 200%', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeStarterHydration(2.5))

    expect(result.current.starterHydration).toBe(2.0)
    expect(result.current.clampNotes.starterHydration.clamped).toBe(true)
  })

  it('clamps dough temperature below minimum to 15', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeDoughTemperature(10))

    expect(result.current.doughTemperature).toBe(15)
    expect(result.current.clampNotes.doughTemperature.clamped).toBe(true)
  })

  it('clamps dough temperature above maximum to 35', () => {
    const { result } = renderHook(() => useRecipeCalculator())

    act(() => result.current.changeDoughTemperature(40))

    expect(result.current.doughTemperature).toBe(35)
    expect(result.current.clampNotes.doughTemperature.clamped).toBe(true)
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
