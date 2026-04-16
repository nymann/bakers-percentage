# Flag Off Hides Execution Tab

## Scenario

```gherkin
Given the `editorial-shell` flag is ON
And the `execution-view` flag is OFF
When the shell renders
Then the nav contains Planning and History tabs only
And no Execution tab is reachable by role "tab"
```
