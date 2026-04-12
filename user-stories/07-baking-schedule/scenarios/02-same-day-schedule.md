# Same-Day Schedule

## Scenario

```gherkin
Given sourdough with a same-day fermentation window (no cold phase)
And bake time is today 18:00
When the schedule is generated
Then the schedule omits cold retard steps
And it includes events in order:
  | Event                    |
  | Feed your starter        |
  | Mix dough                |
  | Bulk fermentation begins |
  | Shape                    |
  | Preheat oven             |
  | Bake                     |
  | Ready to eat             |
```
