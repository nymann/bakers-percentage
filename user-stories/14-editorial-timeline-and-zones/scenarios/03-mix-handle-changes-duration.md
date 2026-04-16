# Mix Handle Adjusts Fermentation Duration

## Scenario

```gherkin
Given the editorial Planning view is open with sourdough leavening and the timeline rendered
And the bake handle is fixed at time T_bake
When the mix handle is dragged 2 hours earlier
Then the fermentation duration (mix → bake) has increased by approximately 2 hours
And the recommended starter % updates accordingly
```
