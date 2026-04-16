import { useMemo, useState } from 'react'
import { useActiveView, type ViewId } from '../../../application/use-cases/useActiveView'
import { useMediaQuery } from '../../../design-system/headless/useMediaQuery'
import { useFeatureFlag } from '../../../use-feature-flag'
import { RecipeCalculator } from '../planning/RecipeCalculator'
import { ExecutionView } from '../execution/ExecutionView'
import { HistoryView } from '../history/HistoryView'
import { SideNavBar } from './SideNavBar'
import { TopNavBar } from './TopNavBar'

export function EditorialShell() {
  const executionEnabled = useFeatureFlag('execution')
  const historyEnabled = useFeatureFlag('history')

  const enabledViews = useMemo<readonly ViewId[]>(() => {
    const views: ViewId[] = ['planning']
    if (executionEnabled) views.push('execution')
    if (historyEnabled) views.push('history')
    return views
  }, [executionEnabled, historyEnabled])

  const view = useActiveView({ enabledViews })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const openSettings = () => setSettingsOpen(true)
  const closeSettings = () => setSettingsOpen(false)

  const goToExecution = () => view.switchTo('execution')
  const goToHistory = () => view.switchTo('history')

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-on-surface font-body">
      {isDesktop ? (
        <SideNavBar view={view} onOpenSettings={openSettings} />
      ) : (
        <TopNavBar view={view} onOpenSettings={openSettings} />
      )}
      <main className="flex-1 min-w-0 px-3 sm:px-6 md:px-10 py-4 md:py-8">
        <section {...view.getPanelProps('planning')}>
          <RecipeCalculator
            settingsOpen={settingsOpen}
            onCloseSettings={closeSettings}
            canStartBake={executionEnabled}
            onBakeStarted={goToExecution}
          />
        </section>
        {executionEnabled && (
          <section {...view.getPanelProps('execution')}>
            <ExecutionView onBakeFinished={historyEnabled ? goToHistory : undefined} />
          </section>
        )}
        {historyEnabled && (
          <section {...view.getPanelProps('history')}>
            <HistoryView />
          </section>
        )}
      </main>
    </div>
  )
}
