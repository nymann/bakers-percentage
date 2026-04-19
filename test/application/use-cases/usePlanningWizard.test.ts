import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePlanningWizard } from '../../../src/application/use-cases/usePlanningWizard'

describe('usePlanningWizard: default state', () => {
  it('starts on the setup step', () => {
    const { result } = renderHook(() => usePlanningWizard())
    expect(result.current.currentStep).toBe('setup')
    expect(result.current.isSetup).toBe(true)
    expect(result.current.isTiming).toBe(false)
  })
})

describe('usePlanningWizard: step transitions', () => {
  it('goToTiming advances to the timing step', () => {
    const { result } = renderHook(() => usePlanningWizard())

    act(() => result.current.goToTiming())

    expect(result.current.currentStep).toBe('timing')
    expect(result.current.isTiming).toBe(true)
    expect(result.current.isSetup).toBe(false)
  })

  it('goToSetup returns to the setup step', () => {
    const { result } = renderHook(() => usePlanningWizard())

    act(() => result.current.goToTiming())
    act(() => result.current.goToSetup())

    expect(result.current.currentStep).toBe('setup')
  })
})

describe('usePlanningWizard: panel prop-getters', () => {
  it('hides the timing panel while on setup', () => {
    const { result } = renderHook(() => usePlanningWizard())

    expect(result.current.getSetupPanelProps().hidden).toBe(false)
    expect(result.current.getTimingPanelProps().hidden).toBe(true)
  })

  it('hides the setup panel once timing is active', () => {
    const { result } = renderHook(() => usePlanningWizard())

    act(() => result.current.goToTiming())

    expect(result.current.getSetupPanelProps().hidden).toBe(true)
    expect(result.current.getTimingPanelProps().hidden).toBe(false)
  })

  it('each panel has role="region" and links to its step indicator', () => {
    const { result } = renderHook(() => usePlanningWizard())

    const setupPanel = result.current.getSetupPanelProps()
    const timingPanel = result.current.getTimingPanelProps()

    expect(setupPanel.role).toBe('region')
    expect(timingPanel.role).toBe('region')
    expect(setupPanel.id).not.toBe(timingPanel.id)
    expect(setupPanel['aria-labelledby']).toBeTruthy()
    expect(timingPanel['aria-labelledby']).toBeTruthy()
  })
})

describe('usePlanningWizard: step indicator prop-getters', () => {
  it('marks the current step with aria-current="step"', () => {
    const { result } = renderHook(() => usePlanningWizard())

    expect(result.current.getStepIndicatorProps('setup')['aria-current']).toBe('step')
    expect(result.current.getStepIndicatorProps('timing')['aria-current']).toBeUndefined()
  })

  it('clicking a step indicator switches to that step', () => {
    const { result } = renderHook(() => usePlanningWizard())

    act(() => result.current.getStepIndicatorProps('timing').onClick())

    expect(result.current.currentStep).toBe('timing')
  })
})

describe('usePlanningWizard: navigation buttons', () => {
  it('the next button advances to timing', () => {
    const { result } = renderHook(() => usePlanningWizard())

    act(() => result.current.getNextButtonProps().onClick())

    expect(result.current.currentStep).toBe('timing')
  })

  it('the back button returns to setup', () => {
    const { result } = renderHook(() => usePlanningWizard())

    act(() => result.current.goToTiming())
    act(() => result.current.getBackButtonProps().onClick())

    expect(result.current.currentStep).toBe('setup')
  })
})
