# Editorial Planning View

## Slice
6 — Editorial Design System

## Story
As a baker, I want the Planning view to use the editorial design language, so that configuring a recipe feels like reading a well-typeset cookbook without losing any existing behavior.

## Visual reference
`../editorial-mockup.html.md` (Planning section — asymmetric `md:col-span-7` / `md:col-span-5` grid, sticky ledger, connector-line ingredient rows, arc preview).

## Acceptance Criteria
- `editorial-planning` flag: OFF → current inline-styled `RecipeCalculator`; ON → editorial rewrite
- All existing Planning behavior preserved — existing role/label queries stay green
- Tests never assert on class names, colors, or data attributes
- Finished weight: S / M / L segmented control backed by `useSegmented` (Radix RadioGroup) with numeric override input
- Loaf count retained as numeric stepper
- Leavening: two toggle cards (sourdough, yeast) via `useToggleCard` (`aria-pressed`)
- Hydration presets: segmented chips via `useSegmented`; custom hydration via escape hatch
- Advanced fieldset: `useDisclosure` (Radix Collapsible) with `aria-expanded` / `aria-controls`
- Bake time: existing `<input type="datetime-local">` preserved (visual slider out of scope — deferred to future story)
- Ingredients render as a `Ledger` molecule — accessible `<table>` with `role="table"`, editorial typography
- Baking schedule renders as `ArcPreview` molecule — stateless list styled as an arc
- Layout: two-column on `md+` (form left, ledger right sticky); stacked on mobile
- Headless primitives extracted into `design-system/headless/` only on second use (`useSegmented` used for both weight + hydration → extracted; `useDisclosure` extracted when a second disclosure appears)
- Styled atoms in `design-system/atoms/` (`Button`, `Card`, `FormLabel`, `Icon`, `SegmentedSelector`, `ToggleCard`, `Disclosure`)
- Molecules in `design-system/molecules/` (`Ledger`, `ArcPreview`)
- Feature flag checks live at the boundary in `App.tsx` / `RecipeCalculator.tsx` — not inside hooks or primitives
- `architecture.test.ts` green; depcruise rules updated to forbid `design-system/**` → `application/**` / `domain/**`
