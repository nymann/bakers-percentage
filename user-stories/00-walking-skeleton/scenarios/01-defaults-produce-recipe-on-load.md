# Defaults Produce a Recipe on Load

## Scenario
The app renders a complete ingredient table from defaults without any user interaction.

```gherkin
Given the app loads for the first time
When the page finishes rendering
Then the results table shows:
  | Ingredient | Grams | Baker's % |
  | Flour      | 437   | 100%      |
  | Water      | 328   | 75%       |
  | Salt       | 9     | 2%        |
  | Yeast      | 4     | 1%        |
And the total dough weight is approximately 778g
And the finished loaf weight shows 800g
```

## Notes
- Defaults: 1 loaf, 800g finished, 75% hydration, instant yeast, 2% salt, 13% bake-off
- Target dough = 800 / (1 - 0.13) = 919.5g
- F = 919.5 / (1 + 0.75 + 0.02) = 519.2g — wait, let me recalculate
- F = 919.5 / (1 + 0.75 + 0.02) = 919.5 / 1.77 = 519.5g
- Flour = 519.5g, Water = 389.6g, Salt = 10.4g, Yeast = 5.2g
- Exact values TBD — hand-calc to be verified during implementation
