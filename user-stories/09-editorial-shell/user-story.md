# Editorial Shell with View Navigation

## Slice
6 — Editorial Design System

## Story
As a baker, I want a modern editorial shell with top app bar and view navigation, so that I can move between Planning, Execution, and History with a coherent visual language.

## Acceptance Criteria
- Tailwind (build-time, not CDN), shadcn/ui CLI, Radix UI installed
- `tailwind.config.js` ports palette, `borderRadius`, `fontFamily` from `../editorial-mockup.html.md`
- Google Fonts (Noto Serif, Manrope, Material Symbols) loaded via `index.html`
- `components.json` configures shadcn CLI to emit atoms into `src/design-system/atoms/` (not default `components/ui/`), with utils alias at `src/design-system/lib/utils.ts`, preserving the existing atoms/molecules/headless triad and the `design-system-pure` depcruise rule
- `editorial-shell` flag: OFF → current layout unchanged; ON → new shell
- Three views reachable via nav: Planning (default), Execution, History
- `useActiveView` hook (headless) owns active view state
  - Exposes `activeView`, `switchTo(view)`, `getTabProps(view)`, `getPanelProps(view)`
  - `getTabProps` provides `role="tab"`, `aria-selected`, `tabIndex`, `onClick`, `onKeyDown`
  - `getPanelProps` provides `role="tabpanel"`, `hidden`, `aria-labelledby`
- Arrow-key navigation between tabs; `Home`/`End` jump to first/last
- Active tab receives `aria-selected="true"`; only active panel visible
- Top app bar + side nav on desktop (`lg:` breakpoint); bottom nav on mobile
- One hook feeds all three styled adapters (TopAppBar, SideNavBar, BottomNavBar)
- Planning panel renders existing `RecipeCalculator` unchanged (no behavior regression)
- `architecture.test.ts` green — `useActiveView` in `application/use-cases/`, adapters in `adapters/driving/shell/`
