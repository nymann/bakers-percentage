# Handles Snap to 15-Minute Increments

## Scenario

```gherkin
Given the editorial Planning view is open with sourdough leavening and the timeline rendered
When the bake handle is set to a value 7 minutes past a quarter hour
Then the resulting bake time is rounded to the nearest 15-minute mark
And the same snapping applies to the mix handle
```
