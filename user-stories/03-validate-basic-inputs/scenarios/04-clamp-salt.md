# Clamp Salt Percentage to Valid Range

## Scenario Outline

```gherkin
Given the advanced section is expanded
When the user enters <input>% for salt
Then salt is set to <result>%
And a note explains the valid range is 0-5%

Examples:
  | input | result |
  | -1    | 0      |
  | 8     | 5      |
```
