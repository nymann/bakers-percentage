# Timeline Replaces Bake Time

## Scenario

```gherkin
Given the editorial Planning view is open with sourdough leavening
When the view renders
Then a slider labeled "Mix handle" is present
And a slider labeled "Bake handle" is present
And the legacy "Bake time" datetime input is not in the document
```
