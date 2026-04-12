# Shared Inputs Preserved When Switching Leavening

## Scenario

```gherkin
Given sourdough is selected
And the user has set 2 loaves, 900g, 70% hydration
When the user switches to instant yeast
Then loaves remains 2
And finished weight remains 900g
And hydration remains 70%
And the recipe recalculates with those values and yeast leavening
```
