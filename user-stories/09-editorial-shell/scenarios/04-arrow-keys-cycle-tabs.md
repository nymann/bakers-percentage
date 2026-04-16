# Arrow Keys Cycle Tabs

## Scenario

```gherkin
Given the `editorial-shell` flag is ON
And the Planning tab has keyboard focus
When the user presses the Right arrow key
Then focus moves to the Execution tab
And the Execution tab has `aria-selected="true"`
When the user presses the Right arrow key again
Then focus moves to the History tab
When the user presses the Right arrow key from the last tab
Then focus wraps to the Planning tab
```
