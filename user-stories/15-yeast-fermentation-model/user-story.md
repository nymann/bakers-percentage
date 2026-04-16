# Predictive Yeast Fermentation Model

## Slice
8 — Predictive Yeast Modeling

## Story
As a baker using commercial yeast (instant or fresh), I want the
fermentation timeline to behave the same way it does for sourdough —
draggable handles, colored zones, a recommended yeast % that responds
to duration and temperature — so that I can plan a yeast bake with the
same precision as a sourdough bake instead of relying on a fixed
~4h45m schedule.

## Background
`YeastSchedule` (`src/domain/BakingSchedule.ts`) currently hardcodes a
90-min first rise + 285-min total prebake regardless of room
temperature, yeast type, or yeast quantity. The editorial Planning
view hides the fermentation timeline entirely when leavening is
"yeast" and falls back to a single `BakeTimeField`
(`EditorialPlanningView.tsx:329`).

In practice yeast fermentation depends on the same variables as
sourdough — temperature, hydration, inoculum % — plus a couple yeast-
specific ones (instant vs. fresh equivalence, salt inhibition).
Q10 ≈ 2.2 for *S. cerevisiae* in lean dough is the rule-of-thumb model
used here as a first pass. See `inbox.md` for the full-model gaps
(empirical Arroyo-López 2009 cardinal parameters, Cauvain & Young
proof-time models, salt coefficient).

Cold-retard for yeast is included in scope: yeast keeps fermenting in
the fridge (unlike LAB-only retard), so a separate
`YeastRetardFermentation` strategy is needed — it cannot be reduced
to ambient yeast at 4 °C.

## Prerequisite Refactor
Land in a separate commit before scenario 1:

- Rename `FermentationStrategy.starterPercent` → `inoculumPercent`
  on the interface and both existing implementations
  (`RatkowskyFermentation`, `RetardFermentation`). Adapter sites:
  `useStarterRecommendation`, `useRecipeCalculator`, the advanced
  settings dialog. The sourdough-flavored name leaks into the yeast
  strategy otherwise.

## Acceptance Criteria
- Yeast leavening (both instant and fresh) renders the same
  `FermentationTimeline` as sourdough — `showSourdoughAdvanced`
  gating is removed
- A `YeastFermentation` strategy implements `FermentationStrategy`
  and computes a recommended yeast % from total duration + room
  temperature + salt %, using Q10 = 2.2 with reference (1% IDY,
  24 °C, 4 h, 1.8% salt)
- Switching between instant and fresh scales the recommended % by
  the IDY → fresh ratio (3×)
- Salt above the reference 1.8% scales the recommendation upward
  to compensate for yeast inhibition; salt below the reference
  scales it downward. First-pass coefficient: linear factor of
  ~10% rate change per 1% salt deviation from reference (refine
  with literature in follow-up — see inbox.md)
- A `YeastRetardFermentation` strategy handles room temperatures
  below the cold threshold; recommendation accounts for continued
  yeast activity at fridge temperatures. Schedule starts at "mix
  dough" — no bloom step
- Fermentation zone bands (green/yellow/red) recompute from
  yeast-specific boundaries — much shorter windows than sourdough
  (green ~2–6 h at 24 °C, scaling with Q10)
- Over-proof and under-proof warnings appear at zone boundaries
- Recommended yeast % is surfaced as a Ledger ingredient row (the
  yeast quantity falls out of the recipe naturally) and is
  overridable in the Advanced Settings dialog — mirrors the
  sourdough starter % pattern
- Tests query by role and accessible name; no class assertions
- `architecture.test.ts` and depcruise remain green
- `references/sources.md` gains entries for any cited sources used
  to justify constants beyond the Q10 heuristic

## Resolved Decisions
- **Salt feeds the model now**, with a first-pass linear
  coefficient. Refining to a literature-backed inhibition curve
  is a follow-up captured in `inbox.md`.
- **Render location:** Ledger row + Advanced Settings override,
  mirroring sourdough starter %. No separate inline display.
- **No bloom step** in the cold-retard yeast schedule. Bakers who
  bloom dry yeast can do it off-schedule.
- **Slice 8 — Predictive Yeast Modeling.** New slice, parallel
  to slice 7 (Editorial Planning Tools).
