# Shortening Duration Returns to a Same-Day Yeast Schedule

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And the room temperature is 22°C
And the fermentation duration is 14 hours
And the schedule lists a "Refrigerate" event
When the fermentation duration is changed to 4 hours
Then the schedule does not list a "Refrigerate" event
And the schedule does not list a "Remove from fridge" event
And the schedule lists a "Mix dough" event
```
