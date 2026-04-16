import { useActiveView } from '../../../application/use-cases/useActiveView'
import { useMediaQuery } from '../../../design-system/headless/useMediaQuery'
import { RecipeCalculator } from '../planning/RecipeCalculator'
import { ExecutionView } from '../execution/ExecutionView'
import { HistoryView } from '../history/HistoryView'
import { TopAppBar } from './TopAppBar'
import { SideNavBar } from './SideNavBar'
import { BottomNavBar } from './BottomNavBar'

const DESKTOP_BREAKPOINT = '(min-width: 1024px)'

export function EditorialShell() {
  const view = useActiveView()
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
          <section {...view.getPanelProps('execution')}>
            <ExecutionView />
          </section>
          <section {...view.getPanelProps('history')}>
            <HistoryView />
          </section>
        </main>
      </div>
      {!isDesktop && <BottomNavBar view={view} />}
    </div>
  )
}
