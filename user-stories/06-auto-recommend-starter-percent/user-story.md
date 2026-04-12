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
- Cold retard bulk split: 3h at 24°C (scales linearly: 2h@27°C, 4h@21°C); remainder is cold phase
- Fridge temperature hardcoded at 4°C
- Adapter selected by CalculateRecipe based on FermentationWindow.hasColdPhase()
- Recommended starter % matches empirical tables within tolerance (same-day ±15%, cold retard ±20%)
- Recommendation note shown: "Starter % recommended for Xh window at Y°C / Z% hydration"
- User can override the recommended starter % via the manual input
- User can override the auto-selected method (counter / fridge) and see starter % recalculate
- "Use recommended" link appears when the user has overridden starter % or method; clicking it restores the auto-calculated values
- Datetime picker replaces the manual fermentation duration input from Slice 2; initial bake time derived from the previously set duration to preserve user intent
