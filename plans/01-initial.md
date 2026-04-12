# Baker's Percentage Calculator — Initial Plan

## Goal

Vue 3 single-page app that calculates ingredient weights for a bread loaf. A
visual timeline is the core interaction for sourdough scheduling. Hostable as a
static site (no backend).

---

## Defaults & First Load

The app must be immediately useful with zero input. On first load:

| Setting | Default | Rationale |
|---|---|---|
| Loaves | 1 | Most home bakers make one loaf |
| Finished weight | 800 g | Standard boule |
| Hydration | 75% ("Open crumb" preset) | Good balance of workability and crumb |
| Leavening | Sourdough | Primary audience |
| Salt % | 2% | Near-universal standard |
| Dough temperature | 24 C | Comfortable room temp |
| Starter hydration | 100% | Most common home starter |
| Bake time | Tomorrow 09:00 local | Overnight cold retard — the most forgiving method |
| Bake-off loss | 13% | Reasonable midpoint; exposed as advanced override |

On load the timeline is pre-positioned, schedule is populated, and the
ingredient table shows real numbers. The user can start adjusting immediately.

---

## Research: Sourdough Fermentation Kinetics

Sources: predictive microbiology literature (Gaenzle 1998, Di Biase 2022,
Vrancken 2011) + artisanal baking community tables.

Starter % is **not a fixed number** — it is derived from the fermentation
window, dough temperature, and hydration. The underlying mechanism is microbial
growth kinetics: starter % sets the initial population, temperature and water
activity modulate the growth rate.

### Key findings

- **Starter % = initial microbial load (N_0).** More starter shifts the growth
  curve left (faster peak), does not change peak height (Di Biase 2022).
- **Temperature modulates growth rate** via Ratkowsky square-root relationship.
  At fridge temps (~4 C), yeast mu_max -> ~0 (T ~ T_min) but LAB continue at
  reduced rate (lower T_min). This is why cold-retarded dough sours without
  rising (Vrancken 2011).
- **Hydration modulates growth rate** via water activity (a_w). Wetter doughs
  ferment faster due to greater microbial mobility and enzymatic activity
  (Gaenzle 1998). Effect is modest within typical bread range (68-82%) but
  non-negligible.

### Empirical validation tables (contract test fixtures)

Room-temp guidance (100% hydration starter, 75% dough hydration):

| Dough temp | ~4 h | ~6 h | ~8 h | ~12 h |
|---|---|---|---|---|
| 27 C (80 F) | 20% | 10% | 5%  | 2-3% |
| 24 C (75 F) | 30% | 15% | 10% | 5%   |
| 21 C (70 F) | 40% | 20% | 12% | 7%   |

Cold retard (3-5 C after 2-4 h bulk at 24 C, 75% hydration):

| Cold retard duration | Starter % |
|---|---|
| 8-12 h | 7-10% |
| 12-24 h | 5-8% |
| 24-48 h | 3-5% |

Fermentation window zones (24 C, 75% hydration):

| Window      | Zone   | Method                        | Starter % |
|-------------|--------|-------------------------------|-----------|
| < 4 h       | Red    | Not feasible for sourdough    | --        |
| 4-6 h       | Yellow | Same-day, tight               | 25-30%    |
| 6-14 h      | Green  | Same-day, ideal               | 8-20%     |
| 14-24 h     | Green  | Overnight cold retard, ideal  | 5-10%     |
| 24-36 h     | Yellow | Long cold retard, very sour   | 3-5%      |
| > 36 h      | Red    | Over-fermentation risk        | --        |

---

## Baker's Math

All percentages relative to **total flour weight (F)**.

### Solving for flour weight

    # User enters finished loaf weight; dough = finished / (1 - bake_off_pct)
    # bake_off_pct defaults to 0.13, exposed as advanced override
    target_dough = target_finished_weight / (1 - bake_off_pct)
    F = target_dough / (1 + hydration + salt_pct)

### Yeast recipe
    flour  = F
    water  = F * hydration
    salt   = F * 0.02
    yeast  = F * 0.01   (instant); * 0.03 (fresh)

### Sourdough recipe
    starter_weight   = F * starter_pct          # derived from window + temp
    starter_flour    = starter_weight / (1 + starter_hydration)
    starter_water    = starter_weight * starter_hydration / (1 + starter_hydration)
    base_flour       = F - starter_flour
    additional_water = F * hydration - starter_water
    salt             = F * 0.02

---

## UI Layout

### Step 1 — Basics (always visible)
- Number of loaves + finished weight per loaf (g)
- Hydration: Classic (68%) | Open crumb (75%) | High hydration (82%) — with %
  shown; custom % input unlocks when user clicks a value to override
- Leavening: **Sourdough** | **Instant yeast** | **Fresh yeast**

**Advanced section** (collapsed by default):
- Salt % (default 2%; affects flavour/crust only, not schedule)
- Dough temperature C (default 24 C; affects starter % recommendation)
- Starter hydration % (sourdough only; default 100%)
- Bake-off loss % (default 13%; affects total dough weight calculation)

### Step 2 — Schedule (sourdough only)

**Timeline component** — horizontal bar representing the next 48 h from now:

```
Now ---------------------------------------------------------- +48 h
     #### red #### yellow #### green #### green #### yellow #### red
                          <---------------------------->
                        [Mix handle]        [Bake handle]
```

- Background painted with zone colours (red/yellow/green) relative to bake handle
- Two draggable handles: **Mix** (left) and **Bake** (right)
- Bake handle defaults to tomorrow 09:00; mix handle defaults to green-zone position
- Dragging either handle live-updates: method (counter/fridge), starter %, starter
  feed time, and the schedule breakdown below
- Handles snap to 15-min increments
- If mix handle is dragged into red: show warning, disable recipe output

**Below the timeline — derived schedule** (read-only, updates live):
```
Sun 21:00  Feed your starter
Mon 07:00  Mix dough  <-- mix handle
Mon 08:00  Bulk fermentation begins
Mon 12:00  Shape & refrigerate
Mon 12:00  Cold retard begins
Tue 08:00  Remove from fridge, preheat oven
Tue 09:00  Bake  <-- bake handle
Tue 10:00  Ready to eat
```

- Starter feed time = mix time - 10 h (adjusts with dough temp)
- Method (counter vs fridge) auto-selected from window; user can override and see
  the zone recalculate

### Step 3 — Results (always visible, updates live)

| Ingredient | Grams | Baker's % |
|---|---|---|
| Base flour | 450 g | 83% |
| Water | 338 g | 75% |
| Salt | 11 g | 2% |
| Starter (100%) | 90 g | 20% |
| **Total dough** | **889 g** | |

- Small note: "Starter % recommended for 14 h window at 24 C / 75% hydration.
  Override (link)"
- Shows per-loaf and total if multiple loaves

---

## Validation & Edge Cases

Inputs are clamped to sane ranges with clear feedback:

| Input | Valid range | Behaviour outside range |
|---|---|---|
| Loaves | 1-20 | Clamp, show note |
| Finished weight | 100-5000 g | Clamp, show note |
| Hydration | 50-100% | Clamp, show note |
| Salt % | 0-5% | Clamp, show note |
| Dough temperature | 15-35 C | Clamp, show note |
| Starter hydration | 50-200% | Clamp, show note |
| Bake-off loss | 5-25% | Clamp, show note |
| Bake time | Now + 4 h to now + 48 h | Disable red-zone handles |
| Mix-to-bake window | >= 4 h | Red zone warning, recipe disabled |
| Starter % | Capped so base_flour > 0 | Clamp, show note |

**Starter % upper bound:** At high starter % with high starter hydration, the
flour contributed by the starter can approach or exceed total flour weight F.
Enforce: `starter_pct < (1 + starter_hydration) / starter_hydration` so that
`base_flour` remains positive. UI clamps before domain construction.

Domain objects enforce these invariants at construction.

---

## Architecture: Hexagonal (Ports & Adapters)

### Dependency rules

```
domain      <-  depends on nothing outside domain
application <-  depends on domain + ports only (never on adapters)
adapters    <-  depend on ports + domain
```

### Layer map

```
     +-------------------------------------------+
     |              driving adapters              |
     |   (Vue components, TimelineSlider, ...)    |
     +-------------------+------------------------+
                         | calls
     +-------------------v------------------------+
     |            application/                     |
     |   usecases/   <-->   port/                  |
     |  CalculateRecipe    FermentationPort        |
     |  PlanSchedule       TimePort                |
     +-------------------+------------------------+
                         | uses domain objects
     +-------------------v------------------------+
     |               domain/                       |
     |  Recipe  BakingSchedule  IngredientList     |
     |  FermentationWindow  Loaf  Leavening        |
     +-------------------^------------------------+
                         |
     +-------------------+------------------------+
     |             driven adapters                 |
     |  SameDayFermentationAdapter                 |
     |  ColdRetardFermentationAdapter              |
     |  BrowserTimeAdapter                         |
     +--------------------------------------------+
```

### Ports (interfaces owned by the application)

**Driven ports** — use case calls out through these:

```ts
// application/port/FermentationPort.ts
interface FermentationPort {
  recommendStarterPct(window: FermentationWindow): number
  buildSchedule(bakeTime: Date, window: FermentationWindow): BakingSchedule
  describeMethod(): string
}

// application/port/TimePort.ts
// All time arithmetic uses date-fns internally (via adapters) to avoid
// DST boundary bugs when schedules span midnight or 24-48 h windows.
interface TimePort {
  now(): Date
}
```

### Adapter selection

The `FermentationWindow` value object knows whether it includes a cold phase
(coldHours > 0). The use case selects the adapter:

```ts
// application/usecases/CalculateRecipe.ts
class CalculateRecipe {
  constructor(
    private sameDayFermentation: FermentationPort,
    private coldRetardFermentation: FermentationPort,
    private time: TimePort,
  ) {}

  execute(request: RecipeRequest): RecipeResponse {
    const fermentation = request.window.hasColdPhase()
      ? this.coldRetardFermentation
      : this.sameDayFermentation
    // ...
  }
}
```

Both adapters are injected at construction. The use case picks based on the
window — no factory indirection needed.

### Use cases

```ts
// application/usecases/CalculateRecipe.ts
// Orchestrates: select adapter, compute starter %, build ingredient list + schedule

// application/usecases/PlanSchedule.ts
class PlanSchedule {
  constructor(
    private sameDayFermentation: FermentationPort,
    private coldRetardFermentation: FermentationPort,
    private time: TimePort,
  ) {}
  execute(bakeTime: Date, window: FermentationWindow): BakingSchedule { ... }
}
```

### Driven adapters

```ts
// adapters/driven/SameDayFermentationAdapter.ts
// implements FermentationPort — logistic + Ratkowsky + water activity

// adapters/driven/ColdRetardFermentationAdapter.ts
// implements FermentationPort — two-phase logistic (bulk + cold retard)

// adapters/driven/BrowserTimeAdapter.ts
// implements TimePort — returns new Date()
```

### Driving adapters

Vue components are the driving adapters. They receive user events, construct
requests, call use cases, and render responses. Components do not touch domain
objects directly — they work with plain request/response types.

---

## Object Model (domain)

Small objects playing roles, sending messages (Alan Kay OO). Strategy pattern
for fermentation — domain objects never know which strategy they're talking to
(that's the port's job).

```
FermentationWindow (value object)
  bulkHours: number
  coldHours: number
  doughTempC: number
  fridgeTempC: number
  hydration: number
  ---
  hasColdPhase(): boolean          # coldHours > 0
  totalHours(): number             # bulkHours + coldHours
  zone(): "red" | "yellow" | "green"  # classifies itself per zone table

Loaf (value object)
  finishedWeightG: number
  hydration: number
  saltPct: number
  bakeOffPct: number
  leavening: Leavening
  ---
  targetDoughWeight(): number      # finishedWeightG / (1 - bakeOffPct)
  totalFlourWeight(): number       # targetDoughWeight / (1 + hydration + saltPct)

Recipe (rich domain object)
  loaf: Loaf
  starterPct: number
  starterHydration: number
  ---
  ingredientsFor(count: number): IngredientList   # computes all ingredient weights
  totalDoughWeight(count: number): number

BakingSchedule (value object)
  events: ScheduleEvent[]
  starterFeedTime: Date
  ---
  mixTime(): Date
  bakeTime(): Date

IngredientList (value object)
  rows: { name, grams, bakersPct }[]
  ---
  total(): number
  perLoaf(count: number): IngredientList
```

Invariants enforced at construction via validation ranges (see Validation &
Edge Cases section). Invalid inputs throw — driving adapters clamp before
constructing domain objects so throws indicate programmer error, not user error.

---

## Testing Strategy

```
tests/
  domain/          — no doubles; domain objects talk to each other directly
  application/     — collaboration tests; ports are test doubles (stubs/spies)
  adapters/
    driven/        — contract tests; adapter must satisfy port contract
    driving/       — component tests via Vue Test Utils; use cases are stubs
```

**Domain tests** — pure behaviour, no doubles needed:
- `FermentationWindow.zone()` pinned to zone table
- `Loaf.totalFlourWeight()` and `targetDoughWeight()` verified against hand-calc
- `Recipe.ingredientsFor()` tested with real value objects against baker's math

**Application tests** — collaboration via test doubles:
```ts
// CalculateRecipe.test.ts
const sameDay = {
  recommendStarterPct: vi.fn().mockReturnValue(0.10),
  buildSchedule: vi.fn().mockReturnValue(stubSchedule),
  describeMethod: vi.fn().mockReturnValue('Same-day'),
}
const coldRetard = { /* same shape, different values */ }
const time = { now: vi.fn().mockReturnValue(new Date('2026-04-13T09:00:00')) }
const useCase = new CalculateRecipe(sameDay, coldRetard, time)
// assert: selects correct adapter based on window.hasColdPhase()
// assert: passes window to adapter, returns assembled response
```

**Adapter contract tests** — driven adapters prove they honour the port:
- `SameDayFermentationAdapter` passes the 12-point empirical table (+/-15%)
- `ColdRetardFermentationAdapter` passes the 3-point cold retard table (+/-20%)

**Driving adapter tests** — Vue components via Vue Test Utils:
- Render with stubbed use case, assert UI reflects response
- Simulate user interaction (drag handle, change input), assert use case called
  with correct request
- Assert validation feedback shown when inputs hit range limits
- No real domain logic exercised — use cases are stubs

---

## Starter % Model

### Primary model — logistic growth (Di Biase 2022)

    N(t) = N_max / (1 + (N_max / N_0 - 1) * e^(-mu_max * t))

- N(t)    = dough volume at time t
- N_max   = maximum rise capacity (gluten/food limited)
- N_0     = starter % (initial microbial load)
- mu_max  = maximum specific growth rate (modified by secondary models)

Inverted to recommend starter % given target time and desired rise fraction a:

    N_0 = N_max / (1 + (1/a - 1) * e^(mu_max * t))

### Secondary model — temperature (Ratkowsky; Vrancken 2011)

    sqrt(mu_max_temp) = b * (T - T_min)

- T       = dough temperature (C)
- T_min   = minimum growth temperature (~3 C yeast, ~1 C LAB)
- b       = species-specific constant (fitted to empirical table)

### Secondary model — hydration / water activity (Gaenzle 1998)

    mu_max(a_w) ~ sqrt(a_w - a_w_min)

- a_w     = water activity (increases with hydration %)
- a_w_min = minimum water activity for growth

### Adapter strategy

**SameDayFermentationAdapter** — logistic + Ratkowsky + water activity.
Parameters (b, T_min, N_max) fitted to 12-point empirical table. Contract tests
verify +/-15% against table values.

**ColdRetardFermentationAdapter** — two-phase logistic:
1. Room-temp bulk: logistic model as above
2. Cold phase: mu_max recalculated at fridge temp via Ratkowsky; yeast
   contribution near-zero, LAB continues at reduced rate.
Contract tests verify +/-20% against cold retard table.

---

## Project Structure

    src/
      domain/
        FermentationWindow.ts         # value object with zone()
        Loaf.ts                       # value object with flour math
        Leavening.ts                  # value object / enum
        Recipe.ts                     # rich domain object
        BakingSchedule.ts             # value object
        IngredientList.ts             # value object
      application/
        port/
          FermentationPort.ts         # driven port
          TimePort.ts                 # driven port
        usecases/
          CalculateRecipe.ts          # selects adapter, orchestrates
          PlanSchedule.ts
      adapters/
        driven/
          SameDayFermentationAdapter.ts
          ColdRetardFermentationAdapter.ts
          BrowserTimeAdapter.ts
        driving/
          BasicsPanel.vue             # step 1 inputs
          TimelineSlider.vue          # coloured timeline + draggable handles
          ScheduleBreakdown.vue       # renders BakingSchedule
          ResultsTable.vue            # renders IngredientList
      App.vue
    tests/
      domain/
        Recipe.test.ts
        Loaf.test.ts
        FermentationWindow.test.ts
      application/
        usecases/
          CalculateRecipe.test.ts     # ports are test doubles
          PlanSchedule.test.ts
      adapters/
        driven/
          SameDayFermentationAdapter.test.ts   # contract vs empirical table
          ColdRetardFermentationAdapter.test.ts
        driving/
          BasicsPanel.test.ts         # Vue Test Utils, stubbed use cases
          TimelineSlider.test.ts
          ResultsTable.test.ts
    index.html
    package.json
    vite.config.ts

---

## Delivery Slices

Each slice is a shippable increment. Later slices build on earlier ones.

### Slice 1 — Yeast recipe calculator

Domain: `Loaf`, `Leavening`, `Recipe`, `IngredientList`
Use case: `CalculateRecipe` (yeast path only — no fermentation port needed)
UI: `BasicsPanel` + `ResultsTable`
Tests: domain + application + driving adapter

Proves the architecture end-to-end. No timeline, no fermentation math.
Defaults populated on load; user sees a working ingredient table immediately.

### Slice 2 — Sourdough with manual starter %

Domain: add `FermentationWindow` (zone classification only)
UI: add starter % input to BasicsPanel (sourdough mode); show zone indicator
Tests: domain (zone classification)

User picks starter % themselves. No timeline yet, but zone feedback tells them
if their choice is reasonable.

### Slice 3 — Fermentation model + adapter contract tests

Adapters: `SameDayFermentationAdapter`, `ColdRetardFermentationAdapter`
Port: `FermentationPort`
Use case: `CalculateRecipe` now selects adapter, recommends starter %
Tests: contract tests vs empirical tables

Starter % is now auto-recommended. No timeline yet — user sets bake time via a
datetime picker, fermentation window is derived.

### Slice 4 — Schedule generation

Domain: `BakingSchedule`
Use case: `PlanSchedule`
Adapter: `BrowserTimeAdapter`
UI: `ScheduleBreakdown`
Tests: application + driving adapter

User sees the full event schedule (feed starter, mix, bulk, shape, bake).
Still using datetime picker, not visual timeline.

### Slice 5 — Visual timeline

UI: `TimelineSlider` replaces datetime picker
- Zone-coloured background
- Draggable mix + bake handles with 15-min snap
- Live recalculation on drag
- Debounce use-case invocation during drag (fire on handle rest, not per pixel)
  to avoid jank from repeated logistic/Ratkowsky calculations
Tests: driving adapter (handle interactions, zone rendering)

This is the riskiest UI piece. Everything else works without it.

---

## Stack

- **Vue 3** — Composition API + `<script setup>`
- **TypeScript**
- **Vite** — static build, zero backend
- **Vitest** — unit + contract tests
- **Vue Test Utils** — driving adapter (component) tests
- **date-fns** — immutable date arithmetic (DST-safe schedule calculations)
- **Tailwind CSS** — styling
- Deploy: GitHub Pages, Netlify, or Cloudflare Pages

---

## Resolved decisions

| # | Decision |
|---|---|
| 1 | Salt %: advanced override (0-5%), excluded from scheduling math |
| 2 | Fresh yeast: included in v1 at 3x instant yeast amount |
| 3 | Starter hydration: default 100%, override in advanced section |
| 4 | Starter % model: logistic growth + Ratkowsky temp + water activity; two-phase for cold retard |
| 5 | Timeline: real clock times, browser local timezone |
| 6 | Dough temperature: default 24 C, override in advanced section |
| 7 | Architecture: Hexagonal (Ports & Adapters) |
| 8 | OO style: Alan Kay — small objects, rich domain, message passing |
| 9 | Test doubles: used only at application layer for port collaborators |
| 10 | Adapter selection: use case picks based on FermentationWindow.hasColdPhase() |
| 11 | Bake-off loss: default 13%, exposed as advanced override |
| 12 | Defaults: app is fully populated on first load (see Defaults table) |
| 13 | Validation: domain enforces invariants; UI clamps inputs before construction |
| 14 | Delivery: five incremental slices, each independently shippable |
| 15 | Driving adapter tests: Vue Test Utils with stubbed use cases |
| 16 | Time arithmetic: use `date-fns` in adapters to avoid DST edge cases |
| 17 | Starter % clamped so base_flour stays positive (derived from starter_hydration) |
| 18 | Timeline drag: debounce use-case invocation to prevent UI jank |

---

## References

- Di Biase, M. et al. (2022). Modeling of growth and organic acid kinetics...
  during *L. plantarum* fermentation in liquid sourdough. *Foods*, 11(23), 3942.
  doi:10.3390/foods11233942 — Cited by 14.
- Gaenzle, M. G. et al. (1998). Modeling of growth of *L. sanfranciscensis* and
  *C. milleri* in response to process parameters of sourdough fermentation.
  *Appl. Environ. Microbiol.*, 64(7), 2616-2623.
  doi:10.1128/aem.64.7.2616-2623.1998 — Cited by 309.
- Vrancken, G. et al. (2011). Influence of temperature and backslopping time on
  the microbiota of a type I propagated laboratory wheat sourdough fermentation.
  *Appl. Environ. Microbiol.*, 77(8), 2716-2726.
  doi:10.1128/aem.02470-10 — Cited by 129.
