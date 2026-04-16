# Empty State Uses Design System Primitive

## Scenario

```gherkin
Given the `history-view` flag is ON
And `useBakeHistory` returns an empty list
When the History panel renders
Then the empty state region is queryable by accessible name
And the empty state uses the `EmptyState` design-system primitive
And no custom per-feature empty-state markup is used
```
