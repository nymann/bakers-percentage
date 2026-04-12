# Change Finished Weight

## Scenario

```gherkin
Given the app is showing a recipe for 1 loaf at 800g
When the user changes finished weight to 1000g
Then flour, water, salt, and yeast grams all increase proportionally
And baker's percentages remain unchanged
```
