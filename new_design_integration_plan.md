# `new_design.md` Integration Plan — Headless-First

**Methodology:** Every UI change follows Headless Component Patterns per `CLAUDE.md` and `../agentic-flow/frontend/end-to-end-agent-flow.md`. Brain (hook) + Looks (styled adapter) split on every widget. Prop-getters at the design-system boundary. Tokens applied in Refactor only. Role-based tests as a11y gate.

## Summary

`new_design.md` is a static Tailwind HTML mockup of three views: **Planning** (maps to current `RecipeCalculator`), **Execution** (new), **History** (new). Current app is inline-styled React with hexagonal architecture. Integrate the editorial design language without coupling state to styling — every interactive element splits into a headless hook + styled adapter.

## Phase 0 — Foundation (no UI change)

- Install Tailwind + PostCSS + autoprefixer devDeps (build-time, not CDN).
- `tailwind.config.js`: port full palette, `borderRadius`, `fontFamily` from the mockup's config block.
- Add Google Fonts (Noto Serif, Manrope, Material Symbols) via `index.html`.
- Extend `src/design-system/tokens.ts`: mirror Tailwind tokens as typed constants for non-Tailwind paths. Keep legacy keys during transition.
- Add Tailwind directives in `src/design-system/styles.css`, imported from `main.tsx`.
- Run full suite + depcruise → confirm green baseline.

**No hooks or components touched.** Purely infrastructure.

## Phase 1 — Shell & navigation (headless-first)

### Brain
- `src/domain/View.ts`: `type View = 'planning' | 'execution' | 'history'`.
- `src/application/use-cases/useActiveView.ts` — headless hook.
  - Returns `{ activeView, switchTo(view), getTabProps(view), getPanelProps(view) }`.
  - `getTabProps` provides `role="tab"`, `aria-selected`, `tabIndex`, `onClick`, `onKeyDown` (arrow-key nav between tabs).
  - `getPanelProps` provides `role="tabpanel"`, `hidden`, `aria-labelledby`.
  - Tests (headless, via `renderHook` + `act`): switching updates `activeView`; arrow keys cycle tabs; `aria-selected` flips.

### Looks
- `adapters/driving/shell/AppShell.tsx` — layout scaffold (header / aside / main / bottom nav slots).
- `adapters/driving/shell/TopAppBar.tsx` — consumes `useActiveView`, spreads `getTabProps` onto `<a>` tags styled with Tailwind.
- `adapters/driving/shell/SideNavBar.tsx` — desktop nav; same hook, same prop-getters, different presentation.
- `adapters/driving/shell/BottomNavBar.tsx` — mobile nav; same hook, same prop-getters.

Three styled adapters share **one** headless hook. Swap one adapter, the other two and the hook stay untouched.

### Feature flag
- `editorial-shell` (OFF → current layout; ON → new shell). Flag check lives at the boundary in `App.tsx`, never inside the hook.

### Tests
- Hook unit tests for `useActiveView` (headless).
- Component test: `AppShell` with all three navs renders, clicking any tab switches panel. Query by `role="tab"` + accessible name — no class/data-attr selectors.

## Phase 2 — Headless design-system primitives

Build primitives only as Phase 3 consumes them (second-use rule — do not speculate).

For each: headless hook + unstyled render-prop/prop-getter API in `design-system/headless/`, then one styled adapter in `design-system/atoms/` (or `molecules/`) that spreads the props with Tailwind classes.

| Primitive | Headless hook | Exposes |
|---|---|---|
| **Segmented selector** (S/M/L, leavening, hydration presets) | `useSegmented<T>({ value, onChange, options })` | `getRootProps`, `getOptionProps(option)`, keyboard nav, `role="radiogroup"` / `role="radio"` |
| **Toggle card** (leavening cards) | `useToggleCard({ selected, onSelect })` | `getCardProps` with `aria-pressed`, keyboard activation |
| **Disclosure** (collapsible "Advanced" fieldset) | `useDisclosure({ defaultOpen })` | `getTriggerProps` (`aria-expanded`, `aria-controls`), `getPanelProps` (`id`, `hidden`) |
| **Slider** (time selector in mockup) | `useSlider({ min, max, step, value, onChange })` | `getTrackProps`, `getThumbProps` (`role="slider"`, `aria-valuenow/min/max`), pointer + keyboard handlers |
| **Checkbox list** (fold steps in Execution view) | `useCheckboxList({ items })` | `getItemProps` per row with `role="checkbox"`, `aria-checked` |
| **Progress step** (baking arc nodes) | `useProgressStep({ status })` | `getStepProps` with `aria-current`, state-driven classes |

**Styled adapters** (`design-system/atoms/` `molecules/`):
- `Button.tsx` — variants `primary | tonal | ghost | chip`.
- `Card.tsx` — surface-container variants.
- `FormLabel.tsx` — tracked uppercase label.
- `Icon.tsx` — Material Symbols wrapper.
- `SegmentedSelector.tsx` — wraps `useSegmented`, spreads props onto buttons.
- `Ledger.tsx` — ingredient rows with connector line. Stateless — pure display.
- `ArcPreview.tsx` — consumes array from schedule hook, styles it.

### Tests
- Each headless hook tested without rendering (state + prop-getter shape + keyboard).
- Each styled atom tested via Testing Library querying by `role` only.

## Phase 3 — Port `RecipeCalculator` to Planning view

### Step A — Extract state logic first (refactor before change)

Audit existing `RecipeCalculator.tsx` for inline state. Move any ad-hoc state into existing or new hooks. Commit separately. Per CLAUDE.md: *first make the change easy, then make the easy change.*

Known candidates:
- `useNumberInput` already headless — keep as is.
- Hydration preset selection already in `useRecipeCalculator` — verify it returns prop-getter-friendly shape or wrap it.
- Leavening type + yeast type already in hook — good.
- Bake-time `datetime-local` input → extract `useBakeTimeInput` if needed.

### Step B — Rewrite JSX only, preserve hook contracts

- Replace inline-styled `<div>`s and `<input>`s with new atoms/primitives from Phase 2.
- Mapping:
  - Finished weight + loaf count → `SegmentedSelector` for S/M/L presets + numeric escape hatch.
  - Leavening → two toggle cards via `useToggleCard`.
  - Hydration presets → `SegmentedSelector` chips.
  - Advanced fieldset → `Disclosure` primitive.
  - Bake time → prominent card (keep `<input type="datetime-local">` as the canonical control; mockup slider is deferred to its own story).
  - Ingredient table → `Ledger` molecule (still a `<table>` semantically).
  - Baking schedule → `ArcPreview` molecule.
- All existing feature flags stay; flag gates wrap the same regions.

### Step C — Red/Green/Refactor per scenario

All existing tests query by role/label → they must stay green through the rewrite. Any failure indicates a semantics regression, not a styling regression.

Tokens applied in Refactor phase only. No test asserts on class names or colors.

## Phase 4 — Execution + History views (stub)

- `adapters/driving/execution/ExecutionView.tsx` — scaffold mockup layout with placeholder content. Gated by `execution-view` flag (default OFF).
- `adapters/driving/history/HistoryView.tsx` — scaffold only. Gated by `history-view` flag (default OFF).
- Headless hooks `useActiveBatch`, `useBakingArc` created empty-shaped so the views compile. Full behavior lands via BDD scenarios in future stories.

Primitives built in Phase 2 (checkbox list, progress step, disclosure) are reused here — validating the headless split pays off.

## Phase 5 — Tests & guards

- `architecture.test.ts` stays authoritative.
- Shell components in `adapters/driving/shell/` — they orchestrate `useActiveView`, so they live outside `design-system/`.
- `design-system/headless/` must have **zero** framework-DOM imports beyond React's hook primitives — no business logic, no feature flags.
- `design-system/atoms/` + `molecules/` — may consume `design-system/headless/` and tokens only.
- depcruise rules updated if needed to forbid `adapters/driving/**` → other `adapters/driving/**` imports and `design-system/**` → `application/**` / `domain/**`.
- Component tests: role/label queries only. Any class-based or data-attribute selector is a regression.

## Phase 6 — Cleanup

- Remove `style={{…}}` inline objects from `RecipeCalculator.tsx`.
- Drop legacy tokens from `tokens.ts` when no references remain.
- Remove `editorial-shell` flag after editorial shell is default-on and stable.
- Remove any duplicated state primitives that predate the headless split.

## File layout (end state)

```
src/
├── domain/
│   └── View.ts
├── application/
│   └── use-cases/
│       ├── useActiveView.ts               ← headless nav brain
│       └── … (existing recipe hooks unchanged)
├── adapters/
│   └── driving/
│       ├── shell/
│       │   ├── AppShell.tsx
│       │   ├── TopAppBar.tsx
│       │   ├── SideNavBar.tsx
│       │   └── BottomNavBar.tsx
│       ├── planning/
│       │   └── RecipeCalculator.tsx       ← rewritten JSX
│       ├── execution/
│       │   └── ExecutionView.tsx
│       └── history/
│           └── HistoryView.tsx
└── design-system/
    ├── tokens.ts
    ├── styles.css
    ├── headless/                          ← brain-only primitives
    │   ├── useSegmented.ts
    │   ├── useToggleCard.ts
    │   ├── useDisclosure.ts
    │   ├── useSlider.ts
    │   ├── useCheckboxList.ts
    │   └── useProgressStep.ts
    ├── atoms/
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── FormLabel.tsx
    │   ├── Icon.tsx
    │   └── Table.tsx                      ← existing
    └── molecules/
        ├── SegmentedSelector.tsx
        ├── Ledger.tsx
        └── ArcPreview.tsx
```

## Open questions

1. Does `new_design.md` supersede Slice 5 visual-timeline (`user-stories/08-visual-timeline`), or does Slice 5's draggable timeline still land inside Planning's "Desired Finish Time" card? If the latter, `useSlider` primitive is built in Phase 2 rather than deferred.
2. Execution + History views — are there user stories drafted, or scaffold as empty shells only?
3. Tailwind adoption: full Tailwind + JIT acceptable, or restrict to token-driven styles to stay framework-agnostic? (Mockup assumes Tailwind.)
4. Mobile / desktop nav — one headless hook feeding three styled adapters with Tailwind responsive classes (`hidden lg:flex`), or render-prop swap driven by a viewport hook?
5. Keep `datetime-local` input as the canonical time control, or build the slider-based control now (unblocks Phase 3 but adds a `useSlider` dependency)?
6. Sticky-right ledger layout on md+ — required initially, or acceptable to ship stacked and iterate?
7. Feature-flag granularity — one `editorial-shell` flag covering nav + visual rewrite, or split (`editorial-nav`, `editorial-planning`)?
