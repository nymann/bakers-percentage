# Enter Custom Hydration

## Scenario

```gherkin
Given the app is showing a recipe with "Open crumb" preset selected
When the user clicks the displayed hydration percentage
Then a custom input field becomes editable
When the user enters 70%
Then the recipe recalculates with 70% hydration
And no preset appears selected
```
