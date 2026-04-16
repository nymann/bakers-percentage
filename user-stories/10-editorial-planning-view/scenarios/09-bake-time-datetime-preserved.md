# Bake Time Datetime Input Preserved

## Scenario

```gherkin
Given the `editorial-planning` flag is ON
When the Planning view renders for a sourdough recipe
Then the bake time control is an `<input type="datetime-local">`
And the input is queryable by label "Bake time"
And changing the input updates the baking schedule
And no visual timeline slider is rendered in this story (deferred)
```
