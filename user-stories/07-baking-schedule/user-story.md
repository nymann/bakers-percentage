# See Baking Schedule from Bake Time

## Slice
4 — Schedule Generation

## Story
As a sourdough baker, I want to see a full step-by-step schedule working backwards from my desired bake time, so that I know exactly when to feed my starter, mix, shape, and bake.

## Acceptance Criteria
- Schedule includes: feed starter, mix & bulk, shape, (cold retard if applicable), preheat, bake, ready to eat
- Starter feed time = mix time − 10h
- Cold retard steps included only when window has cold phase
- Same-day bake omits cold retard steps
- Schedule uses real clock times in browser local timezone
- Bake time defaults to tomorrow 09:00

### Fixed event durations
- Mix and bulk fermentation are a single event ("Mix & bulk fermentation")
- Bulk duration: 3h at 24°C (scales linearly: 2h at 27°C, 4h at 21°C)
- Remove from fridge: 30 min before preheat (tempering time)
- Preheat oven: 45 min before bake
- Bake: 45 min
- Cool before eating: 30 min after bake

### Yeast schedule
- Yeast recipes also show a schedule (no empty space when yeast is selected)
- Yeast events in order: Mix dough → First rise (1.5h) → Shape → Second rise (45 min) → Preheat oven (45 min) → Bake (45 min) → Ready to eat (30 min cool)
- No starter feed step for yeast
- No fermentation model needed — yeast proof times are fixed durations
