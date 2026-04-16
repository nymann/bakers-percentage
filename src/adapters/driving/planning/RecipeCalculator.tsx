import { useFeatureFlag } from '../../../use-feature-flag'
import { EditorialPlanningView } from './EditorialPlanningView'

export function RecipeCalculator() {
  const enabled = useFeatureFlag('yeast-recipe-calculator')
  if (!enabled) return null
  return <EditorialPlanningView />
}
