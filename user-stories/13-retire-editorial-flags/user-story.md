# Retire Editorial Shell/Planning Flags

## Slice
6 — Editorial Design System

## Story
As a developer, I want to collapse the editorial-shell and
editorial-planning dual render paths to a single canonical path, so that
new contributors don't have to trace two paths per view and each
behavior is verified once instead of twice.

## Acceptance Criteria
- Preconditions: stories 09, 10, 11, 12 merged; editorial layout
  manually verified across Planning / Execution / History in desktop
  and mobile viewports
- `editorial-shell` and `editorial-planning` entries removed from
  `createInMemoryFeatureFlags` in `src/App.tsx`, from every
  `useFeatureFlag` call site, and from all test fixtures
- Conditional branches gated on the retired flags deleted in `App.tsx`
  and `RecipeCalculator.tsx` — the previously flag-ON path is the only
  path
- `execution-view` and `history-view` flags kept — they still gate
  in-progress views
- Orphaned field files (those not imported by `EditorialPlanningView`)
  and the now-unreachable `RecipeCalculatorView` function deleted;
  discovery via depcruise orphan report or zero-import grep
- Inline `style={{…}}` wrappers in the field files still reused by
  `EditorialPlanningView` (currently FinishedWeightField,
  LoafCountField, SaltField, BakeOffLossField, StarterHydrationField,
  DoughTemperatureField, StarterPercentField, BakeTimeField) replaced
  with Tailwind utilities — after retirement, no `style={{…}}` remains
  under `src/adapters/driving/planning/` except dynamic values computed
  from state (which keep an inline comment explaining why)
- Unreferenced keys in `src/design-system/tokens.ts` removed
- Test fixtures exercising the retired flag-OFF paths removed
- No user-visible behavior change — existing role/label-based tests
  pass unchanged
- `architecture.test.ts` green; depcruise green
