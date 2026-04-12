# Starter Feed Time Adjusts with Mix Time

## Scenario

```gherkin
Given sourdough at 24C dough temperature
When the mix time changes
Then the starter feed time is always mix time minus 10 hours
```
