# Switch from Yeast to Sourdough

## Scenario

```gherkin
Given instant yeast is selected
When the user selects sourdough
Then the starter % input appears with default value 10%
And the starter hydration input appears with default value 100%
And the dough temperature input appears with default value 24°C
And the results table shows base flour, additional water, salt, and starter rows
And the fermentation zone indicator is visible
```
