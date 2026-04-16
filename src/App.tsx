import { FeatureFlagProvider } from './feature-flags'
import { createInMemoryFeatureFlags } from './adapters/driven/InMemoryFeatureFlags'
import { RecipeCalculator } from './adapters/driving/planning/RecipeCalculator'

const featureFlags = createInMemoryFeatureFlags({
  'yeast-recipe-calculator': true,
  'hydration-preset': true,
  'validate-basic-inputs': true,
  'manual-starter-percent': true,
  'fermentation-zone-feedback': true,
  'auto-recommend-starter-percent': true,
  'baking-schedule': true,
  'visual-timeline': true,
})

export function App() {
  return (
    <FeatureFlagProvider service={featureFlags}>
      <RecipeCalculator />
    </FeatureFlagProvider>
  )
}
