# Same-Day Schedule

## Scenario

```gherkin
Given sourdough with a same-day fermentation window (no cold phase) at 24°C
And bake time is today 18:00
When the schedule is generated
Then the schedule omits cold retard steps
And it includes events with times:
  | Event                     | Time          |
  | Feed your starter         | mix − 10h     |
  | Mix & bulk fermentation   | bake − 3h     |
  | Shape                     | mix + 3h      |
  | Preheat oven              | bake − 45m    |
  | Bake                      | 18:00         |
  | Out of oven               | bake + 45m    |
  | Ready to eat              | bake + 1h 15m |
```

## Notes
- Same-day: entire window is bulk fermentation, no cold phase
- Bulk duration 3h at 24°C (same formula as cold retard)
