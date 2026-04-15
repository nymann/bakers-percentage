# Switch Leavening Type

## Slice
2 — Sourdough with Manual Starter %

## Story
As a home baker, I want to switch between sourdough and yeast leavening and see only the inputs relevant to my choice, so that the interface stays focused and uncluttered.

## Acceptance Criteria
- Leavening selector shows three options: Sourdough, Instant yeast, Fresh yeast
- Switching to yeast hides: starter %, starter hydration, fermentation zone indicator, schedule/timeline (when present in later slices)
- Switching to sourdough hides: yeast row in results table
- Switching to sourdough reveals: starter %, starter hydration, dough temperature inputs
- Switching leavening resets recipe to defaults for that leavening type (no stale state carried over)
- Switching preserves shared inputs: loaf count, finished weight, hydration, salt %, bake-off loss
- Results table updates immediately on switch
