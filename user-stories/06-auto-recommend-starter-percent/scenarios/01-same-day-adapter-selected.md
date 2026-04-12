# Same-Day Adapter Selected for No Cold Phase

## Scenario

```gherkin
Given a fermentation window with no cold phase
When CalculateRecipe executes
Then the SameDayFermentationAdapter is used to recommend starter %
```
