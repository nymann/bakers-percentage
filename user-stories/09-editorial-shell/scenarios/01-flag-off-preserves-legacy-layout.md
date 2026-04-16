# Flag Off Preserves Legacy Layout

## Scenario

```gherkin
Given the `editorial-shell` flag is OFF
When the app renders
Then the legacy inline-styled layout is shown
And no top app bar, side nav, or bottom nav is rendered
And the RecipeCalculator is reachable at the root
```
