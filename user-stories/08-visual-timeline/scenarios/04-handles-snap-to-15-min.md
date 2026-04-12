# Handles Snap to 15-Minute Increments

## Scenario

```gherkin
Given the timeline is showing
When the user drags a handle to 09:07
Then the handle snaps to 09:00
When the user drags a handle to 09:08
Then the handle snaps to 09:15
```
