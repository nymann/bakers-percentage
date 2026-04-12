# Yellow Zone for Tight or Very Sour Window

## Scenario Outline

```gherkin
Given sourdough is selected at 24°C and 75% hydration
When the user enters <hours> hours for fermentation duration
Then the zone indicator shows yellow

Examples:
  | hours |
  | 4     |
  | 5     |
  | 30    |
  | 36    |
```
