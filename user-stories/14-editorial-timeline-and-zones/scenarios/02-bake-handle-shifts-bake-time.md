# Bake Handle Shifts Bake Time

## Scenario

```gherkin
Given the editorial Planning view is open with sourdough leavening and the timeline rendered
And the baking schedule lists the current "Out of oven" event at time T
When the bake handle is dragged 60 minutes later
Then the "Out of oven" event time has advanced by approximately 60 minutes
And the slider's `aria-valuetext` reflects the new bake time
```
