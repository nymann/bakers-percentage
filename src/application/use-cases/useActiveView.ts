import { useCallback, useMemo, useState, type KeyboardEvent } from 'react'

export type ViewId = 'planning' | 'execution' | 'history'

export interface ViewDescriptor {
  id: ViewId
  label: string
  disabled: boolean
}

interface ViewMeta {
  id: ViewId
  label: string
}

const VIEW_META: readonly ViewMeta[] = [
  { id: 'planning', label: 'Planning' },
  { id: 'execution', label: 'Execution' },
  { id: 'history', label: 'History' },
] as const

const DEFAULT_ENABLED_VIEWS: readonly ViewId[] = ['planning']

export interface TabProps {
  id: string
  role: 'tab'
  'aria-selected': boolean
  'aria-controls': string
  'aria-disabled': boolean
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

export interface UseActiveViewOptions {
  enabledViews?: readonly ViewId[]
}

export function useActiveView(options: UseActiveViewOptions = {}): UseActiveView {
  const enabledKey = (options.enabledViews ?? DEFAULT_ENABLED_VIEWS).join(',')
  const enabledViews = useMemo<readonly ViewId[]>(
    () => enabledKey.split(',').filter((id): id is ViewId => id.length > 0) as ViewId[],
    [enabledKey],
  )

  const views = useMemo<readonly ViewDescriptor[]>(
    () =>
      VIEW_META.map((meta) => ({
        ...meta,
        disabled: !enabledViews.includes(meta.id),
      })),
    [enabledViews],
  )

  const [activeView, setActiveView] = useState<ViewId>(() => enabledViews[0] ?? 'planning')

  const switchTo = useCallback(
    (view: ViewId) => {
      if (!enabledViews.includes(view)) return
      setActiveView(view)
    },
    [enabledViews],
  )

  const getTabProps = useCallback(
    (view: ViewId): TabProps => {
      const isDisabled = !enabledViews.includes(view)
      const isActive = activeView === view
      return {
        id: tabId(view),
        role: 'tab',
        'aria-selected': isActive,
        'aria-controls': panelId(view),
        'aria-disabled': isDisabled,
        tabIndex: isActive ? 0 : -1,
        onClick: () => {
          if (isDisabled) return
          setActiveView(view)
        },
        onKeyDown: (event) => {
          if (isDisabled) return
          handleTabKeyDown(event, view, enabledViews, setActiveView)
        },
      }
    },
    [activeView, enabledViews],
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
      views,
      switchTo,
      getTabProps,
      getPanelProps,
    }),
    [activeView, views, switchTo, getTabProps, getPanelProps],
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
  order: readonly ViewId[],
  setActiveView: (view: ViewId) => void,
): void {
  const index = order.indexOf(current)
  if (index === -1) return
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
