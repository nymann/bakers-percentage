# Flag Off Hides History Tab

## Scenario

```gherkin
Given the `editorial-shell` flag is ON
And the `history-view` flag is OFF
When the shell renders
Then the nav does not contain a History tab
And no History panel is reachable
```
