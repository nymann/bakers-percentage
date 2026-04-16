import { useMemo } from 'react'
import {
  useActiveView,
  type ViewId,
} from '../../../application/use-cases/useActiveView'
import { useMediaQuery } from '../../../design-system/headless/useMediaQuery'
import { useFeatureFlag } from '../../../use-feature-flag'
import { RecipeCalculator } from '../planning/RecipeCalculator'
import { ExecutionView } from '../execution/ExecutionView'
import { TopAppBar } from './TopAppBar'
import { SideNavBar } from './SideNavBar'
import { BottomNavBar } from './BottomNavBar'

const DESKTOP_BREAKPOINT = '(min-width: 1024px)'

export function EditorialShell() {
  const executionEnabled = useFeatureFlag('execution-view')
  const enabledViews = useMemo<readonly ViewId[]>(
    () =>
      executionEnabled
        ? ['planning', 'execution', 'history']
        : ['planning', 'history'],
    [executionEnabled],
  )
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
          <section {...view.getPanelProps('history')}>
            <PlaceholderPanel title="History" />
          </section>
        </main>
      </div>
      {!isDesktop && <BottomNavBar view={view} />}
    </div>
  )
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="py-12 text-center text-on-surface-variant font-body">
      <h2 className="font-headline text-3xl italic mb-2">{title}</h2>
      <p>Coming soon.</p>
    </div>
  )
}
