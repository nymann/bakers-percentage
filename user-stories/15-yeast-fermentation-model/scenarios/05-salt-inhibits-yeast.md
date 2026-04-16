# Salt Percentage Inhibits Yeast Recommendation

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And room temperature is 24°C
And the fermentation duration is 4 hours
And salt is set to 1.0% of flour weight
And the recommended yeast percent has stabilized
When salt is increased to 2.5% of flour weight
Then the recommended yeast percent increases to compensate for inhibition
And the duration and room temperature remain unchanged
```
