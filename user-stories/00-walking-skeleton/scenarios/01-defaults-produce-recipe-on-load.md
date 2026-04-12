# Defaults Produce a Recipe on Load

## Scenario
The app renders a complete ingredient table from defaults without any user interaction.

```gherkin
Given the app loads for the first time
When the page finishes rendering
Then the results table shows:
  | Ingredient | Grams | Baker's % |
  | Flour      | 520   | 100%      |
  | Water      | 390   | 75%       |
  | Salt       | 10    | 2%        |
  | Yeast      | 5     | 1%        |
And the total dough weight is approximately 925g
And the finished loaf weight shows 800g
```

## Notes
- Defaults: 1 loaf, 800g finished, 75% hydration, instant yeast, 2% salt, 13% bake-off
- Target dough = 800 / (1 − 0.13) = 919.5g
- F = 919.5 / (1 + 0.75 + 0.02) = 519.5g
- Flour ≈ 520g, Water ≈ 390g, Salt ≈ 10g, Yeast ≈ 5g
- Total slightly exceeds target dough because yeast weight is excluded from flour formula per baker's math convention
- Exact rounding rules determined during implementation
