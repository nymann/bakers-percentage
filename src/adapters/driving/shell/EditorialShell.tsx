import { useState } from 'react'
import { useActiveView } from '../../../application/use-cases/useActiveView'
import { useMediaQuery } from '../../../design-system/headless/useMediaQuery'
import { RecipeCalculator } from '../planning/RecipeCalculator'
import { ExecutionView } from '../execution/ExecutionView'
import { HistoryView } from '../history/HistoryView'
import { SideNavBar } from './SideNavBar'
import { TopNavBar } from './TopNavBar'

export function EditorialShell() {
  const view = useActiveView()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const openSettings = () => setSettingsOpen(true)
  const closeSettings = () => setSettingsOpen(false)

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
          />
        </section>
        <section {...view.getPanelProps('execution')}>
          <ExecutionView />
        </section>
        <section {...view.getPanelProps('history')}>
          <HistoryView />
        </section>
      </main>
    </div>
  )
}
