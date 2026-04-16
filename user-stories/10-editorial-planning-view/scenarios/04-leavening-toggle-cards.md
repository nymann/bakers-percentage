# Leavening Toggle Cards

## Scenario

```gherkin
Given the `editorial-planning` flag is ON
And sourdough is the currently selected leavening
Then the Sourdough card has `aria-pressed="true"`
And the Yeast card has `aria-pressed="false"`
When the user activates the Yeast card
Then the Yeast card has `aria-pressed="true"`
And the Sourdough card has `aria-pressed="false"`
And the recipe switches to yeast leavening
```
