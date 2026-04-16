# Flag Off Preserves Legacy Calculator

## Scenario

```gherkin
Given the `editorial-planning` flag is OFF
When the app renders the Planning view
Then the existing inline-styled RecipeCalculator is rendered
And every existing Planning scenario (validation, leavening, hydration, advanced, fermentation, baking schedule) still passes
And no editorial atoms or molecules are rendered
```
