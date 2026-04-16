# Baking Schedule Arc Preview

## Scenario

```gherkin
Given the `editorial-planning` flag is ON
And the leavening is sourdough with a computed baking schedule
When the Planning view renders
Then the baking schedule appears as an ordered list of steps styled as an arc
And each step's label and time are queryable by text
And step nodes expose `aria-current="step"` for the nearest upcoming step
```
