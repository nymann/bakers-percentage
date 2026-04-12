# Clamp Dough Temperature to Valid Range

## Scenario Outline

```gherkin
Given sourdough is selected and the advanced section is expanded
When the user enters <input>°C for dough temperature
Then dough temperature is set to <result>°C
And a note explains the valid range is 15-35°C

Examples:
  | input | result |
  | 10    | 15     |
  | 40    | 35     |
```
