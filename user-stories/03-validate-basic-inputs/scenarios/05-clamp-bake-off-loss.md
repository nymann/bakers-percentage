# Clamp Bake-Off Loss to Valid Range

## Scenario Outline

```gherkin
Given the advanced section is expanded
When the user enters <input>% for bake-off loss
Then bake-off loss is set to <result>%
And a note explains the valid range is 5-25%

Examples:
  | input | result |
  | 2     | 5      |
  | 30    | 25     |
```
