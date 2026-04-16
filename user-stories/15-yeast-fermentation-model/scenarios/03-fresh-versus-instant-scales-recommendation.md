# Fresh Versus Instant Yeast Scales the Recommendation

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And room temperature is 24°C
And the fermentation duration is 4 hours
And the recommended yeast percent has stabilized
When the leavening is switched to "Fresh yeast"
Then the recommended yeast percent is approximately three times the dry-yeast value
And the duration and room temperature remain unchanged
```
