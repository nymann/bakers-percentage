# Fresh-Yeast Cold-Retard Scales by 3× from Instant

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And the room temperature is 22°C
And the fermentation duration is 14 hours
And the recommended yeast quantity is recorded as "instantRetard"
When the leavening is switched to "Fresh yeast"
And the recommended yeast quantity is recorded as "freshRetard"
Then "freshRetard" is approximately 3× "instantRetard"
```
