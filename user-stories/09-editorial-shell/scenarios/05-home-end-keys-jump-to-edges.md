# Home and End Keys Jump to Edges

## Scenario

```gherkin
Given the `editorial-shell` flag is ON
And the Execution tab has keyboard focus
When the user presses Home
Then focus moves to the Planning tab
When the user presses End
Then focus moves to the History tab
```
