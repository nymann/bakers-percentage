import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useActiveView } from '../../../src/application/use-cases/useActiveView'

describe('useActiveView: default state', () => {
  it('defaults to planning', () => {
    const { result } = renderHook(() => useActiveView())
    expect(result.current.activeView).toBe('planning')
  })

  it('lists all three views so they remain discoverable', () => {
    const { result } = renderHook(() => useActiveView())

    expect(result.current.views.map((v) => v.id)).toEqual([
      'planning',
      'execution',
      'history',
    ])
  })

  it('marks execution and history as disabled by default', () => {
    const { result } = renderHook(() => useActiveView())

    const byId = Object.fromEntries(result.current.views.map((v) => [v.id, v.disabled]))
    expect(byId).toEqual({ planning: false, execution: true, history: true })
  })
})

describe('useActiveView: switchTo', () => {
  it('switches to a requested enabled view', () => {
    const { result } = renderHook(() =>
      useActiveView({ enabledViews: ['planning', 'execution'] }),
    )

    act(() => {
      result.current.switchTo('execution')
    })

    expect(result.current.activeView).toBe('execution')
  })

  it('ignores switchTo for a disabled view', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => {
      result.current.switchTo('execution')
    })

    expect(result.current.activeView).toBe('planning')
  })
})

describe('useActiveView: getTabProps', () => {
  it('gives the active tab aria-selected="true"', () => {
    const { result } = renderHook(() => useActiveView())

    const planningProps = result.current.getTabProps('planning')
    expect(planningProps.role).toBe('tab')
    expect(planningProps['aria-selected']).toBe(true)
  })

  it('marks disabled tabs with aria-disabled="true"', () => {
    const { result } = renderHook(() => useActiveView())

    expect(result.current.getTabProps('execution')['aria-disabled']).toBe(true)
    expect(result.current.getTabProps('history')['aria-disabled']).toBe(true)
    expect(result.current.getTabProps('planning')['aria-disabled']).toBe(false)
  })

  it('clicking a disabled tab does not change the active view', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => {
      result.current.getTabProps('history').onClick()
    })

    expect(result.current.activeView).toBe('planning')
  })

  it('onClick activates an enabled tab', () => {
    const { result } = renderHook(() =>
      useActiveView({ enabledViews: ['planning', 'history'] }),
    )

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
  it('arrow keys cycle only through enabled views', () => {
    const { result } = renderHook(() =>
      useActiveView({ enabledViews: ['planning', 'execution', 'history'] }),
    )

    act(() => {
      result.current.getTabProps('planning').onKeyDown(makeKey('ArrowRight'))
    })
    expect(result.current.activeView).toBe('execution')

    act(() => {
      result.current.getTabProps('execution').onKeyDown(makeKey('ArrowRight'))
    })
    expect(result.current.activeView).toBe('history')

    act(() => {
      result.current.getTabProps('history').onKeyDown(makeKey('ArrowRight'))
    })
    expect(result.current.activeView).toBe('planning')
  })

  it('arrow keys on a disabled tab do nothing', () => {
    const { result } = renderHook(() => useActiveView())

    act(() => {
      result.current.getTabProps('execution').onKeyDown(makeKey('ArrowRight'))
    })

    expect(result.current.activeView).toBe('planning')
  })

  it('ArrowLeft wraps among enabled views', () => {
    const { result } = renderHook(() =>
      useActiveView({ enabledViews: ['planning', 'execution', 'history'] }),
    )

    act(() => {
      result.current.getTabProps('planning').onKeyDown(makeKey('ArrowLeft'))
    })

    expect(result.current.activeView).toBe('history')
  })
})

describe('useActiveView: enabledViews filtering', () => {
  it('ArrowRight cycles within enabled views (skips disabled execution)', () => {
    const { result } = renderHook(() =>
      useActiveView({ enabledViews: ['planning', 'history'] }),
    )

    act(() => {
      result.current.getTabProps('planning').onKeyDown(makeKey('ArrowRight'))
    })

    expect(result.current.activeView).toBe('history')

    act(() => {
      result.current.getTabProps('history').onKeyDown(makeKey('ArrowRight'))
    })

    expect(result.current.activeView).toBe('planning')
  })

  it('End jumps to last enabled view', () => {
    const { result } = renderHook(() =>
      useActiveView({ enabledViews: ['planning', 'history'] }),
    )

    act(() => {
      result.current.getTabProps('planning').onKeyDown(makeKey('End'))
    })

    expect(result.current.activeView).toBe('history')
  })
})

describe('useActiveView: Home and End keys', () => {
  it('Home jumps to first enabled view', () => {
    const { result } = renderHook(() =>
      useActiveView({ enabledViews: ['planning', 'execution', 'history'] }),
    )

    act(() => result.current.switchTo('execution'))
    act(() => {
      result.current.getTabProps('execution').onKeyDown(makeKey('Home'))
    })

    expect(result.current.activeView).toBe('planning')
  })

  it('End jumps to last enabled view', () => {
    const { result } = renderHook(() =>
      useActiveView({ enabledViews: ['planning', 'execution', 'history'] }),
    )

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
