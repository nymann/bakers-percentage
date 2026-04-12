# Clamp Loaves to Valid Range

## Scenario Outline

```gherkin
Given the app is loaded
When the user enters <input> for loaf count
Then the loaf count is set to <result>
And a note explains the valid range is 1-20

Examples:
  | input | result |
  | 0     | 1      |
  | -1    | 1      |
  | 25    | 20     |
```
