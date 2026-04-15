# Set Bake Time via Datetime Picker

## Scenario

```gherkin
Given the app loads with sourdough selected
When the bake time datetime picker renders
Then it defaults to tomorrow 09:00 in browser local timezone
When the user changes the bake time to today 18:00
Then the fermentation window recalculates from current time to 18:00
And the starter % recommendation updates for the new window
And the zone indicator updates
```
