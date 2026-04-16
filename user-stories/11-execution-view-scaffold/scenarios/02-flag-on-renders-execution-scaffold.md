# Flag On Renders Execution Scaffold

## Scenario

```gherkin
Given the `editorial-shell` and `execution-view` flags are ON
And the user navigates to the Execution tab
Then the Execution panel is visible
And the panel contains a header, a step checklist region, and a progress arc region
And the content is placeholder data sourced from `useActiveBatch` and `useBakingArc`
```
