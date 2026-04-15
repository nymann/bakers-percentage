# Green Zone for Ideal Window

## Scenario Outline

```gherkin
Given sourdough is selected at 24°C and 75% hydration
When the user enters <hours> hours for fermentation duration
Then the zone indicator shows green

Examples:
  | hours |
  | 6     |
  | 10    |
  | 14    |
  | 20    |
  | 24    |
```
