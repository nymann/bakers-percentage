# Starter Feed Time Adjusts with Mix Time

## Scenario

```gherkin
Given sourdough at 24°C dough temperature
When the mix time changes
Then the starter feed time is always mix time minus 10 hours
```

## Notes
- Starter feed time is a fixed 10h before mix regardless of dough temperature
