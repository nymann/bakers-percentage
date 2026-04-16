# History View Scaffold

## Slice
6 — Editorial Design System

## Story
As a baker, I want a History view where I can revisit past bakes, so that I can repeat the ones that worked and learn from the ones that didn't.

_This slice delivers the scaffold only — placeholder list, no live data. Real history surfaces in later stories._

## Acceptance Criteria
- `history-view` flag: OFF → History nav tab is absent or disabled; ON → tab active, panel renders
- Panel matches the editorial mockup structure (list of past bakes, detail pane placeholder) from `../editorial-mockup.html.md`, with placeholder content only — no live data
- Empty headless hook `useBakeHistory` compiles with an empty-list placeholder shape — no persistence, no business logic
- View is navigable from any other view via the shell nav built in story 09
- No regressions to Planning, Execution, or existing tests
- `architecture.test.ts` green; hook under `application/use-cases/`, view under `adapters/driving/history/`
