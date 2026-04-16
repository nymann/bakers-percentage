# Long Yeast Duration Uses the Cold-Retard Recommendation

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And the room temperature is 22°C
And the fermentation duration is 4 hours
And the recommended yeast quantity at 4 hours is recorded as "yeastSameDay"
When the fermentation duration is changed to 14 hours
And the recommended yeast quantity at 14 hours is recorded as "yeastRetard"
Then "yeastRetard" is less than "yeastSameDay"
And "yeastRetard" is greater than zero
```
