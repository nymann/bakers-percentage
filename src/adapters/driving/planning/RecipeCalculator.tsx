import { EditorialPlanningView } from './EditorialPlanningView'

export interface RecipeCalculatorProps {
  settingsOpen?: boolean
  onCloseSettings?: () => void
  onBakeStarted?: () => void
  canStartBake?: boolean
}

export function RecipeCalculator({
  settingsOpen = false,
  onCloseSettings = () => {},
  onBakeStarted = () => {},
  canStartBake = false,
}: RecipeCalculatorProps = {}) {
  return (
    <EditorialPlanningView
      settingsOpen={settingsOpen}
      onCloseSettings={onCloseSettings}
      onBakeStarted={onBakeStarted}
      canStartBake={canStartBake}
    />
  )
}
