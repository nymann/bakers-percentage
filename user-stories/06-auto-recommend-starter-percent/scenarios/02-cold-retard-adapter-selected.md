# Cold Retard Adapter Selected for Overnight

## Scenario

```gherkin
Given a fermentation window with cold hours > 0
When CalculateRecipe executes
Then the ColdRetardFermentationAdapter is used to recommend starter %
```
