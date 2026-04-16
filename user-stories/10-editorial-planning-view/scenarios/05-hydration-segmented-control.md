# Hydration Segmented Control

## Scenario

```gherkin
Given the `editorial-planning` flag is ON
And the hydration preset list is visible
When the user selects the "80% — Ciabatta" preset
Then the recipe hydration updates to 80%
And the selected preset has `aria-checked="true"`
When the user picks "Custom"
Then a numeric hydration input becomes visible
And typing a value updates the recipe hydration
```
