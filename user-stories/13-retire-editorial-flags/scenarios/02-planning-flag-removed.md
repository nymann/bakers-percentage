# Planning Flag Removed

## Scenario

```gherkin
Given the editorial Planning layout has been manually verified across leavening, hydration, Advanced, and fermentation flows
When the `editorial-planning` key is removed from `createInMemoryFeatureFlags`
Then the Planning adapter renders the editorial layout unconditionally
And the legacy inline-styled branch is deleted from `RecipeCalculator.tsx`
And no `style={{…}}` inline objects remain in `src/adapters/driving/planning/**`
```
