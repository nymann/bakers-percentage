# Multiple Loaves Shows Per-Loaf and Total

## Scenario

```gherkin
Given the app is showing a recipe for 1 loaf at 800g
When the user changes loaf count to 3
Then the results table shows a per-loaf column and a total column
And per-loaf weights match the original 1-loaf recipe
And total weights are 3 times the per-loaf weights
```
