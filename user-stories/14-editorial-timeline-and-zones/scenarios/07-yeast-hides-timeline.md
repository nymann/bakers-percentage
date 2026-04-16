# Yeast Leavening Hides Timeline

## Scenario

```gherkin
Given the editorial Planning view is open
When the leavening is switched to "Yeast"
Then no slider labeled "Mix handle" is in the document
And no slider labeled "Bake handle" is in the document
And the simple "Bake time" datetime input is rendered instead
```
