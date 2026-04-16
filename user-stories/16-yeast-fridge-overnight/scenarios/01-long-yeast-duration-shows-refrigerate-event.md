# Long Yeast Duration Shows a Refrigerate Event

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And the room temperature is 22°C
When the fermentation duration is set to 14 hours
Then the schedule lists a "Refrigerate" event
And the schedule lists a "Remove from fridge" event
```
