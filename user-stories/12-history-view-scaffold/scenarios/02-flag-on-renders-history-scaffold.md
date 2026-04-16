# Flag On Renders History Scaffold

## Scenario

```gherkin
Given the `editorial-shell` and `history-view` flags are ON
And the user navigates to the History tab
Then the History panel is visible
And the panel contains a header, a past-bakes list region, and a detail pane region
And the past-bakes list is empty with an accessible empty state
```
