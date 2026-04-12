# Drag Bake Handle Updates Schedule

## Scenario

```gherkin
Given the timeline is showing with default positions
When the user drags the bake handle to a new time
Then the schedule recalculates for the new bake time
And the starter % recommendation updates
And the zone colors reposition relative to the new bake handle
And the handle snaps to the nearest 15-minute increment
```
