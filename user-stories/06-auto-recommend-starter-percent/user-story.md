# Auto-Recommend Starter Percent from Fermentation Window

## Slice
3 — Fermentation Model

## Story
As a sourdough baker, I want the app to recommend a starter percentage based on my fermentation window, dough temperature, and hydration, so that I don't have to guess.

## Acceptance Criteria
- Bake time set via datetime picker, defaults to tomorrow 09:00
- Fermentation window derived from current time to bake time
- Same-day bake (no cold phase) uses SameDayFermentationAdapter
- Overnight cold retard uses ColdRetardFermentationAdapter
- Adapter selected by CalculateRecipe based on FermentationWindow.hasColdPhase()
- Recommended starter % matches empirical tables within tolerance (same-day ±15%, cold retard ±20%)
- Recommendation note shown: "Starter % recommended for Xh window at Y°C / Z% hydration"
- User can override the recommended starter % via the manual input
- User can override the auto-selected method (counter / fridge) and see starter % recalculate
- Datetime picker replaces the manual fermentation duration input from Slice 2
