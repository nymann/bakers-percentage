# Execution View Scaffold

## Slice
6 — Editorial Design System

## Story
As a baker in the middle of a bake, I want an Execution view scaffold, so that future work can flesh out active-bake tracking without reshuffling the shell.

## Acceptance Criteria
- `execution-view` flag: OFF → Execution nav tab is absent or disabled; ON → tab active, panel renders
- Panel matches the editorial mockup structure (header, step checklist, progress arc placeholder) with placeholder content only — no live data
- Empty headless hooks `useActiveBatch` and `useBakingArc` compile with placeholder shapes (e.g. empty arrays, null state) — no business logic
- Checkbox list of fold steps rendered via `useCheckboxList` (Radix Checkbox) — toggling is visual only (no persistence)
- Progress arc renders via `useProgressStep` primitive with static sample steps
- View is navigable from any other view via the shell nav built in story 09
- No regressions to Planning or existing tests
- `architecture.test.ts` green; hooks under `application/use-cases/`, view under `adapters/driving/execution/`
