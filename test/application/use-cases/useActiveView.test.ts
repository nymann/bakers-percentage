import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveView } from '../../../src/application/use-cases/useActiveView'

describe('useActiveView: default state', () => {
  it('defaults to planning', () => {
    const { result } = renderHook(() => useActiveView())
    expect(result.current.activeView).toBe('planning')
  })
})

describe('useActiveView: switchTo', () => {
  it('switches to the requested view', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => {
      result.current.switchTo('execution')
    })

    expect(result.current.activeView).toBe('execution')
  })
})

describe('useActiveView: getTabProps', () => {
  it('gives the active tab aria-selected="true"', () => {
    const { result } = renderHook(() => useActiveView())

    const planningProps = result.current.getTabProps('planning')
    expect(planningProps.role).toBe('tab')
    expect(planningProps['aria-selected']).toBe(true)
  })

  it('gives inactive tabs aria-selected="false"', () => {
    const { result } = renderHook(() => useActiveView())

    const executionProps = result.current.getTabProps('execution')
    expect(executionProps['aria-selected']).toBe(false)
  })

  it('gives active tab tabIndex 0 and inactive tabs -1', () => {
    const { result } = renderHook(() => useActiveView())

    expect(result.current.getTabProps('planning').tabIndex).toBe(0)
    expect(result.current.getTabProps('execution').tabIndex).toBe(-1)
    expect(result.current.getTabProps('history').tabIndex).toBe(-1)
  })

  it('onClick activates the tab', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => {
      result.current.getTabProps('history').onClick()
    })

    expect(result.current.activeView).toBe('history')
  })
})

describe('useActiveView: getPanelProps', () => {
  it('gives the active panel role="tabpanel" and hidden=false', () => {
    const { result } = renderHook(() => useActiveView())

    const planningPanel = result.current.getPanelProps('planning')
    expect(planningPanel.role).toBe('tabpanel')
    expect(planningPanel.hidden).toBe(false)
  })

  it('gives inactive panels hidden=true', () => {
    const { result } = renderHook(() => useActiveView())

    expect(result.current.getPanelProps('execution').hidden).toBe(true)
    expect(result.current.getPanelProps('history').hidden).toBe(true)
  })

  it('links panel to its tab via aria-labelledby', () => {
    const { result } = renderHook(() => useActiveView())

    const planningTab = result.current.getTabProps('planning')
    const planningPanel = result.current.getPanelProps('planning')
    expect(planningPanel['aria-labelledby']).toBe(planningTab.id)
  })
})

describe('useActiveView: arrow key navigation', () => {
  it('ArrowRight moves from planning to execution', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => {
      result.current.getTabProps('planning').onKeyDown(makeKey('ArrowRight'))
    })

    expect(result.current.activeView).toBe('execution')
  })

  it('ArrowRight from execution moves to history', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => result.current.switchTo('execution'))
    act(() => {
      result.current.getTabProps('execution').onKeyDown(makeKey('ArrowRight'))
    })

    expect(result.current.activeView).toBe('history')
  })

  it('ArrowRight from history wraps to planning', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => result.current.switchTo('history'))
    act(() => {
      result.current.getTabProps('history').onKeyDown(makeKey('ArrowRight'))
    })

    expect(result.current.activeView).toBe('planning')
  })

  it('ArrowLeft from planning wraps to history', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => {
      result.current.getTabProps('planning').onKeyDown(makeKey('ArrowLeft'))
    })

    expect(result.current.activeView).toBe('history')
  })
})

describe('useActiveView: Home and End keys', () => {
  it('Home jumps to planning (first)', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => result.current.switchTo('execution'))
    act(() => {
      result.current.getTabProps('execution').onKeyDown(makeKey('Home'))
    })

    expect(result.current.activeView).toBe('planning')
  })

  it('End jumps to history (last)', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => {
      result.current.getTabProps('planning').onKeyDown(makeKey('End'))
    })

    expect(result.current.activeView).toBe('history')
  })
})

function makeKey(key: string): React.KeyboardEvent {
  let prevented = false
  return {
    key,
    preventDefault: () => {
      prevented = true
    },
    get defaultPrevented() {
      return prevented
    },
  } as unknown as React.KeyboardEvent
}
