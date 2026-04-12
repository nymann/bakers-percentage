# See Fermentation Zone Feedback

## Slice
2 — Sourdough with Manual Starter %

## Story
As a sourdough baker, I want to enter my planned fermentation time and see a red/yellow/green zone indicator, so that I know if my timing is feasible before I commit.

## Acceptance Criteria
- Fermentation window duration input (hours), defaults to 14h (overnight)
- Zone derived from window duration, dough temperature, and hydration
- Red: < 4h or > 36h (not feasible / over-fermentation risk)
- Yellow: 4–6h or 24–36h (tight / very sour)
- Green: 6–24h (ideal range)
- Zone indicator updates live as duration, dough temp, or hydration change
- Red zone shows a warning explaining the risk
