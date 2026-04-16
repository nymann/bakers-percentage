# Room Temperature Shifts the Yeast Zone Bands

## Scenario

```gherkin
Given the editorial Planning view is open with "Dry yeast" leavening
And room temperature is 24°C
And the green zone band spans approximately 2 to 6 hours
When the room temperature is lowered to 14°C
Then the green zone band shifts to span a longer duration window
And the recommended yeast percent at the same duration increases
```
