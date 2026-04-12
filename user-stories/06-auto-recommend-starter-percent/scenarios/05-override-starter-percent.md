# Override Recommended Starter Percent

## Scenario

```gherkin
Given the app has auto-recommended 10% starter for a 14h window at 24°C
When the user manually changes starter % to 15%
Then the recipe recalculates with 15% starter
And the recommendation note indicates the value is a manual override
And the zone indicator updates to reflect the new effective window
```
