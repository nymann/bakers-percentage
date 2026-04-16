# History View Scaffold

## Slice
6 — Editorial Design System

## Story
As a baker, I want a History view scaffold, so that past bakes can be surfaced in a future iteration without reshuffling the shell.

## Acceptance Criteria
- `history-view` flag: OFF → History nav tab is absent or disabled; ON → tab active, panel renders
- Panel matches the editorial mockup structure (list of past bakes, detail pane placeholder) from `../editorial-mockup.html.md`, with placeholder content only — no live data
- Empty headless hook `useBakeHistory` compiles with an empty-list placeholder shape — no persistence, no business logic
- View is navigable from any other view via the shell nav built in story 09
- No regressions to Planning, Execution, or existing tests
- `architecture.test.ts` green; hook under `application/use-cases/`, view under `adapters/driving/history/`
