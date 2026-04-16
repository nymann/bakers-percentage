# Click Nav Switches View

## Scenario

```gherkin
Given the `editorial-shell` flag is ON
And the Planning tab is active
When the user clicks the Execution tab
Then the Execution tab has `aria-selected="true"`
And the Planning tab has `aria-selected="false"`
And the Execution panel is visible
And the Planning panel is hidden
```
