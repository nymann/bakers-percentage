# Red Zone for Infeasible Window

## Scenario Outline

```gherkin
Given sourdough is selected at 24°C and 75% hydration
When the user enters <hours> hours for fermentation duration
Then the zone indicator shows red
And a warning explains "<risk>"

Examples:
  | hours | risk                       |
  | 2     | Not feasible for sourdough |
  | 3     | Not feasible for sourdough |
  | 40    | Over-fermentation risk     |
  | 48    | Over-fermentation risk     |
```
