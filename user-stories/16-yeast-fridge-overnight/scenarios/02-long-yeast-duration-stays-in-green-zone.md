# Long Yeast Duration Stays in the Green Zone

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And the room temperature is 22°C
When the fermentation duration is set to 14 hours
Then the fermentation status announces the green zone
And no over-proof warning is displayed
```
