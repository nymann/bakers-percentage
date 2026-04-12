# Green Zone for Ideal Window

## Scenario Outline

```gherkin
Given sourdough is selected at 24C and 75% hydration
When the fermentation window is <hours> hours
Then the zone indicator shows green

Examples:
  | hours |
  | 6     |
  | 10    |
  | 14    |
  | 20    |
  | 24    |
```
