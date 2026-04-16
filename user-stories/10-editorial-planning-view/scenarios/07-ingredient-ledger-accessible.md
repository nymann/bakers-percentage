# Ingredient Ledger Accessible

## Scenario

```gherkin
Given the `editorial-planning` flag is ON
When the Planning view renders with a computed recipe
Then the ingredient list is queryable by `role="table"`
And each ingredient row has a name cell, grams cell, and baker's-percent cell
And all cells are queryable by text content (no reliance on class names)
And changing the finished weight recomputes all gram cells in the ledger
```
