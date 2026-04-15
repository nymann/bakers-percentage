# Clamp Hydration to Valid Range

## Scenario Outline

```gherkin
Given the app is loaded with custom hydration input active
When the user enters <input>% for hydration
Then hydration is set to <result>%
And a note explains the valid range is 50-100%

Examples:
  | input | result |
  | 30    | 50     |
  | 110   | 100    |
```
