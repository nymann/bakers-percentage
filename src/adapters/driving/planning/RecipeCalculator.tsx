import type { Ref } from 'react'
import { EditorialPlanningView, type PlanningHandle } from './EditorialPlanningView'

export interface RecipeCalculatorProps {
  settingsOpen?: boolean
  onCloseSettings?: () => void
  onBakeStarted?: () => void
  canStartBake?: boolean
  controlRef?: Ref<PlanningHandle>
}

export function RecipeCalculator({
  settingsOpen = false,
  onCloseSettings = () => {},
  onBakeStarted = () => {},
  canStartBake = false,
  controlRef,
}: RecipeCalculatorProps = {}) {
  return (
    <EditorialPlanningView
      settingsOpen={settingsOpen}
      onCloseSettings={onCloseSettings}
      onBakeStarted={onBakeStarted}
      canStartBake={canStartBake}
      controlRef={controlRef}
    />
  )
}

export type { PlanningHandle } from './EditorialPlanningView'
