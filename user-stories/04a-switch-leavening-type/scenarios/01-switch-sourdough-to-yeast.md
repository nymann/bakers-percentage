# Switch from Sourdough to Instant Yeast

## Scenario

```gherkin
Given sourdough is selected with 10% starter and 100% starter hydration
And the results table shows base flour, additional water, salt, and starter rows
When the user selects instant yeast
Then the starter %, starter hydration, and dough temperature inputs are hidden
And the results table shows flour, water, salt, and yeast rows
And the yeast amount is F × 1%
And the fermentation zone indicator is hidden
```
