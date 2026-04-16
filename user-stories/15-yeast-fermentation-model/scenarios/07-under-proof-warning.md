# Under-Proof Duration Shows Warning

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And room temperature is 24°C
When the fermentation duration is set below the yellow zone lower bound
Then the zone status announces "red"
And a warning message indicating insufficient fermentation is displayed
```
