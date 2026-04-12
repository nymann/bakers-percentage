# Select High Hydration Preset

## Scenario

```gherkin
Given the app is showing a recipe at 75% hydration
When the user selects the "High hydration" preset
Then hydration updates to 82%
And the recipe recalculates with 82% hydration
```
