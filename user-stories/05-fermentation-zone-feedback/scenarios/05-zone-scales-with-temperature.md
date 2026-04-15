# Zone Boundaries Scale with Dough Temperature

## Scenario Outline

```gherkin
Given sourdough is selected at <temp>°C and 75% hydration
When the user enters <hours> hours for fermentation duration
Then the zone indicator shows <zone>

Examples:
  | temp | hours | zone   |
  | 27   | 4     | green  |
  | 27   | 3     | yellow |
  | 21   | 6     | yellow |
  | 21   | 8     | green  |
```

## Notes
- At 27°C fermentation is faster, so green zone starts earlier (~4h vs ~6h at 24°C)
- At 21°C fermentation is slower, so green zone starts later (~8h vs ~6h at 24°C)
- Exact boundaries derived from Ratkowsky model; contract tests verify against empirical tables
