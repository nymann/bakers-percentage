import { useMemo } from 'react'
import {
  useActiveView,
  type ViewId,
} from '../../../application/use-cases/useActiveView'
import { useMediaQuery } from '../../../design-system/headless/useMediaQuery'
import { useFeatureFlag } from '../../../use-feature-flag'
import { RecipeCalculator } from '../planning/RecipeCalculator'
import { ExecutionView } from '../execution/ExecutionView'
import { HistoryView } from '../history/HistoryView'
import { TopAppBar } from './TopAppBar'
import { SideNavBar } from './SideNavBar'
import { BottomNavBar } from './BottomNavBar'

const DESKTOP_BREAKPOINT = '(min-width: 1024px)'

export function EditorialShell() {
  const executionEnabled = useFeatureFlag('execution-view')
  const historyEnabled = useFeatureFlag('history-view')
  const enabledViews = useMemo<readonly ViewId[]>(() => {
    const views: ViewId[] = ['planning']
    if (executionEnabled) views.push('execution')
    if (historyEnabled) views.push('history')
    return views
  }, [executionEnabled, historyEnabled])
  const view = useActiveView({ enabledViews })
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT)

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <TopAppBar view={view} />
      <div className="flex min-h-screen pt-20">
        {isDesktop && <SideNavBar view={view} />}
        <main className="flex-1 px-6 md:px-12 py-10 max-w-6xl mx-auto">
          <section {...view.getPanelProps('planning')}>
            <RecipeCalculator />
          </section>
          {executionEnabled && (
            <section {...view.getPanelProps('execution')}>
              <ExecutionView />
            </section>
          )}
          {historyEnabled && (
            <section {...view.getPanelProps('history')}>
              <HistoryView />
            </section>
          )}
        </main>
      </div>
      {!isDesktop && <BottomNavBar view={view} />}
    </div>
  )
}
