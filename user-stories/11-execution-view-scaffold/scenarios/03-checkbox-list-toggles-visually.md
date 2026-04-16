# Checkbox List Toggles Visually

## Scenario

```gherkin
Given the `execution-view` flag is ON
And the Execution panel is visible
When the user toggles a fold-step checkbox
Then the checkbox reports `aria-checked="true"`
When the user toggles it again
Then it reports `aria-checked="false"`
And no business logic fires — state is local to the scaffold
```
