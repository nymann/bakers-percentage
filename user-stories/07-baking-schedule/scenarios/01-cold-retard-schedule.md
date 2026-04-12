# Cold Retard Schedule

## Scenario

```gherkin
Given sourdough with a cold retard window at 24°C
And bake time is tomorrow 09:00
When the schedule is generated
Then it includes events with times:
  | Event                     | Time           |
  | Feed your starter         | mix − 10h      |
  | Mix & bulk fermentation   | bake − cold − 3h |
  | Shape & refrigerate       | mix + 3h       |
  | Cold retard begins        | shape time     |
  | Remove from fridge        | bake − 1h 15m  |
  | Preheat oven              | bake − 45m     |
  | Bake                      | 09:00          |
  | Out of oven               | bake + 45m     |
  | Ready to eat              | bake + 1h 15m  |
And all times are in browser local timezone
```

## Notes
- Bulk duration is 3h at 24°C (2h at 27°C, 4h at 21°C)
- "Remove from fridge" = 30 min tempering + 45 min preheat before bake
- "Ready to eat" = 45 min bake + 30 min cool
