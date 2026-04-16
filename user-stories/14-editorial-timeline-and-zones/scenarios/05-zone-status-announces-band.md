# Status Region Announces Active Zone

## Scenario

```gherkin
Given the editorial Planning view is open with sourdough leavening and the timeline rendered
And the mix handle sits in the green band
When the mix handle is dragged into the yellow band
Then a status region (role "status") announces "yellow"
And when the mix handle is dragged further into the red band
Then the status region announces "red"
And a warning message ("Over-fermentation risk" or "Not feasible for sourdough") is rendered
```
