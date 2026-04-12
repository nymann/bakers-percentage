# Clamp Starter Percent to Keep Base Flour Positive

## Scenario

```gherkin
Given sourdough is selected with 100% starter hydration
When the user enters a starter % that would make base flour zero or negative
Then the starter % is clamped to the maximum safe value
And a note explains that base flour must remain positive
And base flour is greater than zero
```
