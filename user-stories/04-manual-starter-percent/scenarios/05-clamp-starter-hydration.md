# Clamp Starter Hydration to Valid Range

## Scenario Outline

```gherkin
Given sourdough is selected and the advanced section is expanded
When the user enters <input>% for starter hydration
Then starter hydration is set to <result>%
And a note explains the valid range is 50-200%

Examples:
  | input | result |
  | 30    | 50     |
  | 250   | 200    |
```
