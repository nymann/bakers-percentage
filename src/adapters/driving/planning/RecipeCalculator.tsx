import { EditorialPlanningView } from './EditorialPlanningView'

export interface RecipeCalculatorProps {
  settingsOpen?: boolean
  onCloseSettings?: () => void
}

export function RecipeCalculator({
  settingsOpen = false,
  onCloseSettings = () => {},
}: RecipeCalculatorProps = {}) {
  return (
    <EditorialPlanningView
      settingsOpen={settingsOpen}
      onCloseSettings={onCloseSettings}
    />
  )
}
