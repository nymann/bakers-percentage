import { FeatureFlagProvider } from './feature-flags'
import { createInMemoryFeatureFlags } from './adapters/driven/InMemoryFeatureFlags'
import { RecipeCalculator } from './adapters/driving/RecipeCalculator'

const featureFlags = createInMemoryFeatureFlags({
  'yeast-recipe-calculator': true,
  'hydration-preset': true,
  'validate-basic-inputs': true,
})

export function App() {
  return (
    <FeatureFlagProvider service={featureFlags}>
      <RecipeCalculator />
    </FeatureFlagProvider>
  )
}
