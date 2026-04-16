# Finished Weight Segmented Presets

## Scenario

```gherkin
Given the `editorial-planning` flag is ON
When the user selects the "M" finished-weight preset
Then the finished weight updates to the M preset value (900g)
And the "M" option has `aria-checked="true"`
And the "S" and "L" options have `aria-checked="false"`
When the user types a custom weight into the numeric escape-hatch input
Then the recipe uses the custom value
And no preset is marked as active
```
