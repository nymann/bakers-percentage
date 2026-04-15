# See Fermentation Zone Feedback

## Slice
2 — Sourdough with Manual Starter %

## Story
As a sourdough baker, I want to enter my planned fermentation time and see a red/yellow/green zone indicator, so that I know if my timing is feasible before I commit.

## Acceptance Criteria
- Fermentation window duration input (hours), defaults to 14h (overnight)
- Zone derived from window duration, dough temperature, and hydration
- Reference zone boundaries (24°C, 75% hydration):
  - Red: < 4h or > 36h (not feasible / over-fermentation risk)
  - Yellow: 4–6h or 24–36h (tight / very sour)
  - Green: 6–24h (ideal range)
- Zone boundaries scale with temperature and hydration using Ratkowsky + water activity models (same models as starter % recommendation)
  - Higher temp (27°C): zones shift earlier (e.g. green starts ~4h)
  - Lower temp (21°C): zones shift later (e.g. green starts ~8h)
  - Higher hydration: modest shift earlier; lower hydration: modest shift later
- Zone indicator updates live as duration, dough temp, or hydration change
- Red zone shows a warning explaining the risk
- When the user overrides fermentation method (Story 06), zones recalculate for the selected method
