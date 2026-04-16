# Over-Proof Duration Shows Warning

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And room temperature is 24°C
When the fermentation duration is set above the yellow zone upper bound
Then the zone status announces "red"
And a warning message indicating over-proof risk is displayed
```
