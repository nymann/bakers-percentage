# See Baking Schedule from Bake Time

## Slice
4 — Schedule Generation

## Story
As a sourdough baker, I want to see a full step-by-step schedule working backwards from my desired bake time, so that I know exactly when to feed my starter, mix, shape, and bake.

## Acceptance Criteria
- Schedule includes: feed starter, mix, bulk fermentation, shape, (cold retard if applicable), preheat, bake, ready to eat
- Starter feed time = mix time - 10h (adjusted for dough temp)
- Cold retard steps included only when window has cold phase
- Same-day bake omits cold retard steps
- Schedule uses real clock times in browser local timezone
- Bake time defaults to tomorrow 09:00
