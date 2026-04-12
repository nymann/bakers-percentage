# Red Zone for Infeasible Window

## Scenario Outline

```gherkin
Given sourdough is selected at 24C and 75% hydration
When the fermentation window is <hours> hours
Then the zone indicator shows red

Examples:
  | hours |
  | 2     |
  | 3     |
  | 40    |
  | 48    |
```
