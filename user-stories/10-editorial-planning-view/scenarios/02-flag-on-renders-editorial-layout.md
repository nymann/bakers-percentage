# Flag On Renders Editorial Layout

## Scenario

```gherkin
Given the `editorial-planning` flag is ON
When the Planning view renders
Then the recipe form appears in the main column
And an ingredient ledger appears in the sidebar column
And a baking schedule arc preview appears below the ledger
And every role/label used by the legacy scenarios is still queryable
```
