# Yeast Leavening Renders the Fermentation Timeline

## Scenario

```gherkin
Given the editorial Planning view is open
When the leavening is switched to "Fresh yeast"
Then a slider labeled "Mix handle" is present
And a slider labeled "Bake handle" is present
And the simple "Bake time" datetime input is not in the document
```
