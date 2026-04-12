# Validate Basic Inputs

## Slice
1 — Yeast Recipe Calculator

## Story
As a home baker, I want the app to clamp out-of-range inputs and show me a note, so that I don't accidentally create an impossible recipe.

## Acceptance Criteria
- Loaves clamped to 1–20
- Finished weight clamped to 100–5000g
- Hydration clamped to 50–100%
- Salt % clamped to 0–5%
- Bake-off loss clamped to 5–25%
- Each clamp shows a visible note explaining the limit
- Domain objects enforce invariants at construction
- UI clamps before domain construction (throws = programmer error)
