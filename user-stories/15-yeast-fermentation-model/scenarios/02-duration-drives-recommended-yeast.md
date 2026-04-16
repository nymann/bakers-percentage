# Duration Drives Recommended Yeast Percent

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And room temperature is 24°C
And the fermentation duration is 4 hours
When the bake handle is dragged to extend the duration to 8 hours
Then the recommended yeast percent decreases
And the recommended yeast percent for 8 hours is approximately half of the value for 4 hours
```
