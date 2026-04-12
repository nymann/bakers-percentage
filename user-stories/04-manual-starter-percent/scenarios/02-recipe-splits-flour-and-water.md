# Recipe Splits Flour and Water for Starter

## Scenario

```gherkin
Given sourdough is selected with 100% starter hydration
When the user enters 20% starter
Then the recipe shows separate rows for base flour and starter
And starter flour + base flour equals total flour weight
And starter water is subtracted from additional water
And total dough weight remains unchanged
```
