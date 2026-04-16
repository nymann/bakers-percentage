# Cold Room Switches Yeast to Retard Strategy

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And the fermentation duration is 12 hours
When the room temperature is lowered to 4°C
Then the recommended yeast percent reflects continued cold yeast activity
And the recommended yeast percent is greater than zero
And the schedule includes a refrigeration step
```
