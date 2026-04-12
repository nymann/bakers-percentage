# Same-Day Starter Percent Matches Empirical Table

## Scenario Outline

```gherkin
Given a same-day fermentation window at <temp>C, 75% hydration, 100% starter hydration
When the window duration is <hours> hours
Then the recommended starter % is within 15% of <expected_pct>

Examples:
  | temp | hours | expected_pct |
  | 27   | 4     | 20%          |
  | 27   | 6     | 10%          |
  | 27   | 8     | 5%           |
  | 27   | 12    | 2.5%         |
  | 24   | 4     | 30%          |
  | 24   | 6     | 15%          |
  | 24   | 8     | 10%          |
  | 24   | 12    | 5%           |
  | 21   | 4     | 40%          |
  | 21   | 6     | 20%          |
  | 21   | 8     | 12%          |
  | 21   | 12    | 7%           |
```
