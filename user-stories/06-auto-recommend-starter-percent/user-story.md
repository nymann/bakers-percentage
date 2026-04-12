# Auto-Recommend Starter Percent from Fermentation Window

## Slice
3 — Fermentation Model

## Story
As a sourdough baker, I want the app to recommend a starter percentage based on my fermentation window, dough temperature, and hydration, so that I don't have to guess.

## Acceptance Criteria
- Same-day bake (no cold phase) uses SameDayFermentationAdapter
- Overnight cold retard uses ColdRetardFermentationAdapter
- Adapter selected by CalculateRecipe based on FermentationWindow.hasColdPhase()
- Recommended starter % matches empirical tables within tolerance (same-day +/-15%, cold retard +/-20%)
- User can override the recommendation
