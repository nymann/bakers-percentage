# Flag On Renders Shell with Planning Default

## Scenario

```gherkin
Given the `editorial-shell` flag is ON
When the app renders
Then a banner with role "banner" containing the top app bar is shown
And a navigation with role "navigation" listing Planning, Execution, History tabs is shown
And the Planning tab has `aria-selected="true"`
And the Planning panel is visible; Execution and History panels are hidden
And the existing RecipeCalculator renders inside the Planning panel
```
