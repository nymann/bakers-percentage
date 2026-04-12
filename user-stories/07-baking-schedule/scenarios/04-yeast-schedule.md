# Yeast Recipe Shows Proof Schedule

## Scenario

```gherkin
Given instant yeast is selected
And bake time is today 18:00
When the schedule is generated
Then it includes events with times:
  | Event          | Time          |
  | Mix dough      | bake − 4h 45m |
  | First rise     | mix + 0m      |
  | Shape          | mix + 1h 30m  |
  | Second rise    | shape + 0m    |
  | Preheat oven   | bake − 45m    |
  | Bake           | 18:00         |
  | Out of oven    | bake + 45m    |
  | Ready to eat   | bake + 1h 15m |
And there is no "Feed your starter" event
And there is no cold retard event
```

## Notes
- First rise: 1.5h (standard yeast proof at room temp)
- Second rise: 45 min (after shaping)
- Total pre-bake time: 1.5h + 45min + 45min preheat + 45min overlap = 4h 45m before bake
- Preheat overlaps with second rise (start preheat 45min before bake)
- These are fixed durations — no fermentation model needed for yeast
