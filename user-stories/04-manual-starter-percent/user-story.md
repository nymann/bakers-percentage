# Enter Manual Starter Percent for Sourdough

## Slice
2 — Sourdough with Manual Starter %

## Story
As a sourdough baker, I want to enter my own starter percentage and see the recipe split flour and water into base and starter contributions, so that I can use my experience to control fermentation.

## Acceptance Criteria
- Sourdough is the default leavening on first load
- Selecting sourdough reveals starter %, starter hydration, and dough temperature inputs
- Starter % defaults to 10% (green zone for 14h window at 24°C / 75% hydration)
- Starter hydration defaults to 100%
- Dough temperature defaults to 24°C (in advanced section)
- Recipe shows base flour, additional water, salt, and starter as separate rows
- Starter flour and starter water are correctly subtracted from totals
- Starter % clamped so base flour remains positive
- Dough temperature clamped to 15–35°C
- Starter hydration clamped to 50–200%
