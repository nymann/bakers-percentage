# Clamp Finished Weight to Valid Range

## Scenario Outline

```gherkin
Given the app is loaded
When the user enters <input>g for finished weight
Then the finished weight is set to <result>g
And a note explains the valid range is 100-5000g

Examples:
  | input | result |
  | 50    | 100    |
  | 6000  | 5000   |
```
