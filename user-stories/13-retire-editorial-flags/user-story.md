# Retire Editorial Flags and Legacy Layout

## Slice
6 — Editorial Design System

## Story
As a developer, I want to retire the editorial feature flags once stable, so that the codebase reflects a single source of truth and carries no legacy inline styles.

## Acceptance Criteria
- Preconditions: stories 09, 10, 11, 12 merged; editorial layout manually verified across Planning / Execution / History in desktop and mobile viewports
- `editorial-shell` and `editorial-planning` entries removed from `createInMemoryFeatureFlags` in `src/App.tsx`, from `useFeatureFlag` call sites, and from test fixtures
- `execution-view` and `history-view` flags kept only while those views remain WIP; removed when those views reach parity in a later story
- All legacy inline-styled paths deleted from `RecipeCalculator.tsx` (no remaining `style={{…}}` objects in Planning adapter)
- Legacy keys in `src/design-system/tokens.ts` with zero references are deleted
- Dead adapter files (any pre-editorial shell scaffolding) removed
- `architecture.test.ts` green; depcruise green
- No user-visible behavior change — existing role/label-based tests pass unchanged
