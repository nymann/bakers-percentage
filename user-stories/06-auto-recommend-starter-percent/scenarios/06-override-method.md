# Override Fermentation Method

## Scenario

```gherkin
Given a 14h fermentation window that auto-selects cold retard
When the user overrides the method to same-day (counter)
Then the starter % recommendation recalculates using SameDayFermentationAdapter
And the zone indicator updates for the same-day method
```
