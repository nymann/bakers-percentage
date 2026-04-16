import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'

export type ViewId = 'planning' | 'execution' | 'history'

export interface ViewDescriptor {
  id: ViewId
  label: string
}

export const VIEWS: readonly ViewDescriptor[] = [
  { id: 'planning', label: 'Planning' },
  { id: 'execution', label: 'Execution' },
  { id: 'history', label: 'History' },
] as const

export interface TabProps {
  id: string
  role: 'tab'
  'aria-selected': boolean
  'aria-controls': string
  tabIndex: 0 | -1
  onClick: () => void
  onKeyDown: (event: KeyboardEvent) => void
}

export interface PanelProps {
  id: string
  role: 'tabpanel'
  hidden: boolean
  'aria-labelledby': string
  tabIndex: 0
}

export interface UseActiveView {
  activeView: ViewId
  views: readonly ViewDescriptor[]
  switchTo: (view: ViewId) => void
  getTabProps: (view: ViewId) => TabProps
  getPanelProps: (view: ViewId) => PanelProps
}

export function useActiveView(): UseActiveView {
  const [activeView, setActiveView] = useState<ViewId>('planning')

  const switchTo = useCallback((view: ViewId) => {
    setActiveView(view)
  }, [])

  const getTabProps = useCallback(
    (view: ViewId): TabProps => {
      const isActive = activeView === view
      return {
        id: tabId(view),
        role: 'tab',
        'aria-selected': isActive,
        'aria-controls': panelId(view),
        tabIndex: isActive ? 0 : -1,
        onClick: () => setActiveView(view),
        onKeyDown: (event) => handleTabKeyDown(event, view, setActiveView),
      }
    },
    [activeView],
  )

  const getPanelProps = useCallback(
    (view: ViewId): PanelProps => ({
      id: panelId(view),
      role: 'tabpanel',
      hidden: activeView !== view,
      'aria-labelledby': tabId(view),
      tabIndex: 0,
    }),
    [activeView],
  )

  return useMemo(
    () => ({
      activeView,
      views: VIEWS,
      switchTo,
      getTabProps,
      getPanelProps,
    }),
    [activeView, switchTo, getTabProps, getPanelProps],
  )
}

function tabId(view: ViewId): string {
  return `editorial-tab-${view}`
}

function panelId(view: ViewId): string {
  return `editorial-panel-${view}`
}

function handleTabKeyDown(
  event: KeyboardEvent,
  current: ViewId,
  setActiveView: (view: ViewId) => void,
): void {
  const order = VIEWS.map((v) => v.id)
  const index = order.indexOf(current)
  let nextIndex: number | null = null

  switch (event.key) {
    case 'ArrowRight':
      nextIndex = (index + 1) % order.length
      break
    case 'ArrowLeft':
      nextIndex = (index - 1 + order.length) % order.length
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = order.length - 1
      break
  }

  if (nextIndex === null) return
  event.preventDefault()
  const target = order[nextIndex]
  if (target === undefined) return
  setActiveView(target)
  focusTab(event, target)
}

function focusTab(event: KeyboardEvent, view: ViewId): void {
  if (typeof document === 'undefined') return
  const sourceTab = event.currentTarget as HTMLElement | null
  const root = sourceTab?.closest('[role="tablist"]') ?? document
  const target = root.querySelector<HTMLElement>(`#${tabId(view)}`)
  target?.focus()
}
