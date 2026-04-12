# Cold Retard Starter Percent Matches Empirical Table

## Scenario Outline

```gherkin
Given a cold retard window with 2-4h bulk at 24C then fridge at 4C, 75% hydration
When the cold retard duration is <cold_hours> hours
Then the recommended starter % is within 20% of <expected_pct>

Examples:
  | cold_hours | expected_pct |
  | 10         | 8.5%         |
  | 18         | 6.5%         |
  | 36         | 4%           |
```
