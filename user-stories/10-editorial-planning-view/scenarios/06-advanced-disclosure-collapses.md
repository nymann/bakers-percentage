# Advanced Disclosure Collapses

## Scenario

```gherkin
Given the `editorial-planning` flag is ON
And the Advanced section is collapsed by default
Then the Advanced trigger has `aria-expanded="false"`
And the Advanced panel is hidden
When the user activates the Advanced trigger
Then the Advanced trigger has `aria-expanded="true"`
And the Advanced panel becomes visible
And the Salt, Bake-off loss, Starter hydration, and Dough temperature inputs are reachable
```
