# Select Classic Hydration Preset

## Scenario

```gherkin
Given the app is showing a recipe at 75% hydration
When the user selects the "Classic" preset
Then hydration updates to 68%
And the recipe recalculates with 68% hydration
```
