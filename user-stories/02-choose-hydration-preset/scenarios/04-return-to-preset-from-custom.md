# Return to Preset from Custom Hydration

## Scenario

```gherkin
Given the user has entered a custom hydration of 71%
And no preset button is marked as active
When the user clicks the "Classic (68%)" preset
Then hydration updates to 68%
And the custom input is closed
And the "Classic" preset is marked as active
And the recipe recalculates with 68% hydration
```
