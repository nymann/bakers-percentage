import { useState } from 'react'
import { useActiveView } from '../../../application/use-cases/useActiveView'
import { RecipeCalculator } from '../planning/RecipeCalculator'
import { ExecutionView } from '../execution/ExecutionView'
import { HistoryView } from '../history/HistoryView'
import { SideNavBar } from './SideNavBar'

const SHELL_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  gridTemplateAreas: '"nav main"',
} as const

export function EditorialShell() {
  const view = useActiveView()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div
      style={SHELL_STYLE}
      className="min-h-screen bg-background text-on-surface font-body"
    >
      <div style={{ gridArea: 'nav' }}>
        <SideNavBar view={view} onOpenSettings={() => setSettingsOpen(true)} />
      </div>
      <main style={{ gridArea: 'main' }} className="min-w-0 px-6 md:px-10 py-8">
        <section {...view.getPanelProps('planning')}>
          <RecipeCalculator
            settingsOpen={settingsOpen}
            onCloseSettings={() => setSettingsOpen(false)}
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
