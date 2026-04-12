# Cold Retard Schedule

## Scenario

```gherkin
Given sourdough with a cold retard window
And bake time is tomorrow 09:00
When the schedule is generated
Then it includes events in order:
  | Event                    |
  | Feed your starter        |
  | Mix dough                |
  | Bulk fermentation begins |
  | Shape & refrigerate      |
  | Cold retard begins       |
  | Remove from fridge       |
  | Preheat oven             |
  | Bake                     |
  | Ready to eat             |
And starter feed time is mix time minus 10 hours
And all times are in browser local timezone
```
