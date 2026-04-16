# Editorial Timeline with Colored Fermentation Zones

## Slice
7 — Editorial Planning Tools

## Story
As a baker planning a sourdough bake, I want to drag a mix handle and
a bake handle on a fermentation timeline with green / yellow / red
zone bands, so that I can shape a fermentation that lands in the safe
zone without recomputing durations in my head.

## Background
Story 13 collapsed the dual editorial / legacy planning paths and
deleted `TimelineField`, `useTimeline`'s sole consumer. The editorial
view now exposes only `BakeTimeField` (single datetime input) and
renders the fermentation `zone` as a plain text status. The visual
timeline and colored zone bands that lived in the legacy
`RecipeCalculatorView` were never ported. `useTimeline` and
`useFermentationZone.zone` are intact — only the editorial UI binding
is missing.

## Acceptance Criteria
- Editorial Planning view renders a fermentation timeline with two
  range-input handles: one for mix start, one for bake end (sourdough
  only — yeast keeps the simple bake time input)
- Both handles snap to 15-minute increments (per
  `domain/Timeline.SNAP_MINUTES`)
- Timeline track shows three colored bands (green / yellow / red)
  representing safe / cautionary / unsafe fermentation duration
  windows; band boundaries derive from `useFermentationZone` and shift
  with dough temperature + hydration
- Total fermentation duration (mix → bake) drives the starter %
  recommendation (current auto-recommend behavior preserved)
- A live status region announces the current zone band as the user
  drags the mix handle into a different band
- Timeline replaces the existing `BakeTimeField` for sourdough — single
  source of truth for bake time
- New headless hook (`useFermentationTimeline` or extension of
  `useTimeline`) owns the brain; styled adapter spreads prop-getters
  per the headless component pattern in CLAUDE.md
- Tests query by role (`slider`, `status`) and accessible name; no
  class assertions
- `architecture.test.ts` and depcruise remain green

## Open Questions
- Should the colored bands be a separate design-system primitive
  (`ZoneTrack`) or an inline component in the editorial view first,
  extracting per the second-use rule?
