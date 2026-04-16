# Yeast Fridge-Overnight Schedule

## Slice
8 — Predictive Yeast Modeling

## Story
As a baker using commercial yeast (instant or fresh), I want to mix
my dough in the evening, refrigerate it overnight, and bake in the
morning, so that I can fit a yeast bake into a normal weekday
schedule the same way I do with a sourdough cold-retard.

## Background
Story 15 added `YeastRetardFermentation`
(`src/domain/Fermentation.ts:234`) and `createYeastFermentation`
(line 269) routes to it when the temperature is below
`COLD_THRESHOLD` (8 °C). But the planning view never reaches that
branch in a meaningful way:

- `useFermentationZone` always passes a single `tempC` (the room
  temperature slider) into `createYeastFermentation`. There is no
  way to express "mix at 22 °C, retard at 4 °C." Setting room
  temperature to 4 °C is a poor proxy because it changes the bulk
  step too — and is not how a real bake works.
- `useBakingSchedule` for `leavingType === 'yeast'` returns
  `new YeastSchedule(bakeTime).events` unconditionally
  (`useBakingSchedule.ts:12`). Even if a `YeastRetardFermentation`
  strategy were active, its `ColdRetardSchedule` events would be
  discarded — no `Refrigerate` / `Remove from fridge` would appear.

Sourdough already has the parallel: `useStarterRecommendation`
auto-selects fridge fermentation when `totalHours > 12` and
`useBakingSchedule` threads the strategy's events through. Yeast
needs the same shape.

## Acceptance Criteria
- Long yeast durations auto-select `YeastRetardFermentation` via
  the same auto-detect-by-duration pattern sourdough uses (mirror
  `useStarterRecommendation`'s `autoFermentationTemp` logic).
  First-pass threshold: 8 h. Above this, the strategy switches to
  fridge mode regardless of room temperature.
- The schedule for a yeast cold-retard bake includes
  `Refrigerate` and `Remove from fridge` events, matching the
  shape of sourdough's `ColdRetardSchedule`.
- Yeast zone bands recompute from fridge-temp boundaries when in
  retard mode — the green window widens substantially, so a
  14 h overnight retard reads as green/yellow instead of red.
- Recommended yeast % uses
  `YeastRetardFermentation.inoculumPercent` for retard durations
  — much smaller than the same-day recommendation at the same
  total hours.
- Fresh-yeast scaling (3× from instant) applies in retard mode
  the same way it does same-day.
- Reducing duration back below the threshold returns to a
  same-day yeast schedule (no `Refrigerate` event) and the
  same-day recommendation.
- `useBakingSchedule` is updated to thread the yeast strategy's
  `schedule()` events when one is supplied — same pattern as
  sourdough today.
- Tests query by role and accessible name; no class assertions.
- `architecture.test.ts` and depcruise remain green.

## Resolved Decisions
- **No new UI toggle.** Match sourdough's pure-auto-detection by
  duration. The user drags the duration slider past the same-day
  threshold; the schedule snaps to fridge automatically. Manual
  override (`overrideMethod`) exists on the sourdough hook but is
  not wired to any UI today — keep parity, don't introduce new
  surface area in this story.
- **Same-day → cold threshold for yeast: 8 h** (first pass).
  Yeast green-zone at 24 °C is 2–6 h; 8 h + is over-proof for
  ambient. Above 8 h the user is realistically planning a fridge
  retard. Refine if literature suggests otherwise.
- **No bloom step in the cold-retard yeast schedule** — carried
  forward from story 15.
- **Reuse `ColdRetardSchedule`** — already what
  `YeastRetardFermentation.schedule()` returns. No new schedule
  class needed.

## Out of Scope
- Manual fridge-temp override input (e.g. "my fridge runs at
  6 °C"). Use the `FRIDGE_TEMP` constant for now.
- Manual "I want fridge mode at any duration" toggle. If the
  user wants fridge, they pick a duration ≥ 8 h.
- Salt inhibition refinement, fresh-yeast manufacturer table,
  cardinal-temperature parameters — still tracked in `inbox.md`.
