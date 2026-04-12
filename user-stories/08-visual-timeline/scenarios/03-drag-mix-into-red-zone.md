# Drag Mix Handle into Red Zone

## Scenario

```gherkin
Given the timeline is showing with default positions
When the user drags the mix handle into the red zone (< 4h before bake)
Then a warning is displayed
And the recipe output is disabled
```
