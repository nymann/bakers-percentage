# Baker's Percentage Calculator — Initial Plan

## Goal

Vue 3 single-page app that calculates ingredient weights for a bread loaf. A
visual timeline is the core interaction for sourdough scheduling. Hostable as a
static site (no backend).

---

## Research: Sourdough Starter Amount

Sources: The Sourdough Journey, The Perfect Loaf, The Fresh Loaf, TrueSourdough

Starter % is **not a fixed number** — it is derived from the fermentation window
and dough temperature.

### Room-temp fermentation guidance (100% hydration starter)

| Dough temp | ~4 h | ~6 h | ~8 h | ~12 h |
|---|---|---|---|---|
| 27°C (80°F) | 20% | 10% | 5%  | 2–3% |
| 24°C (75°F) | 30% | 15% | 10% | 5%   |
| 21°C (70°F) | 40% | 20% | 12% | 7%   |

### Cold retard (overnight fridge proof)

- Fridge temp: 3–5°C; cold proof: 8–16 h (up to 48 h)
- Typical: short room-temp bulk (2–4 h) then overnight fridge
- Use lower starter % (5–15%) to avoid over-fermentation
- More starter → shorter cold retard time needed

### Fermentation window → method + starter %

Total fermentation window = ready time − mix time − bake time (~1 h)

| Window      | Zone   | Method                        | Starter % (≈24°C) |
|-------------|--------|-------------------------------|-------------------|
| < 4 h       | Red    | Not feasible for sourdough    | —                 |
| 4–6 h       | Yellow | Same-day, tight               | 25–30%            |
| 6–14 h      | Green  | Same-day, ideal               | 8–20%             |
| 14–24 h     | Green  | Overnight cold retard, ideal  | 5–10%             |
| 24–36 h     | Yellow | Long cold retard, very sour   | 3–5%              |
| > 36 h      | Red    | Over-fermentation risk        | —                 |

---

## Baker's Math

All percentages relative to **total flour weight (F)**.

### Solving for flour weight

    # User enters finished loaf weight; dough = finished ÷ 0.87 (≈13% bake-off)
    target_dough = target_finished_weight / 0.87
    F = target_dough / (1 + hydration + salt_pct)

### Yeast recipe
    flour  = F
    water  = F × hydration
    salt   = F × 0.02
    yeast  = F × 0.01   (instant); × 0.03 (fresh)

### Sourdough recipe
    starter_weight   = F × starter_pct          # derived from window + temp
    starter_flour    = starter_weight / (1 + starter_hydration)
    starter_water    = starter_weight × starter_hydration / (1 + starter_hydration)
    base_flour       = F - starter_flour
    additional_water = F × hydration - starter_water
    salt             = F × 0.02

---

## UI Layout

### Step 1 — Basics (always visible)
- Number of loaves + finished weight per loaf (g)
- Hydration: Classic (68%) | Open crumb (75%) | High hydration (82%) — with % shown;
  custom % input unlocks when user clicks a value to override
- Leavening: **Sourdough** | **Instant yeast** | **Fresh yeast**

**Advanced section** (collapsed by default):
- Salt % (default 2%; affects flavour/crust only, not schedule)
- Dough temperature °C (default 24°C; affects starter % recommendation)
- Starter hydration % (sourdough only; default 100%)

### Step 2 — Schedule (sourdough only)

**Timeline component** — horizontal bar representing the next 48 h from now:

```
Now ──────────────────────────────────────────── +48 h
     ████ red ████ yellow ████ green ████ green ████ yellow ████ red
                          ◄────────────────────►
                        [Mix handle]        [Bake handle]
```

- Background painted with zone colours (red/yellow/green) relative to the bake handle
- Two draggable handles: **Mix** (left) and **Bake** (right)
- User sets the bake handle first; mix handle defaults to a green-zone position
- Dragging either handle live-updates: method (counter/fridge), starter %, starter
  feed time, and the schedule breakdown below
- Handles snap to 15-min increments
- If mix handle is dragged into red: show warning, disable recipe output

**Below the timeline — derived schedule** (read-only, updates live):
```
Sun 21:00  Feed your starter
Mon 07:00  Mix dough  ◄── mix handle
Mon 08:00  Bulk fermentation begins
Mon 12:00  Shape & refrigerate
Mon 12:00  Cold retard begins
Tue 08:00  Remove from fridge, preheat oven
Tue 09:00  Bake  ◄── bake handle
Tue 10:00  Ready to eat
```

- Starter feed time = mix time − 10 h (adjusts with dough temp)
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

- Small note: "Starter % recommended for 14 h window at 24°C. Override ↗"
- Shows per-loaf and total if multiple loaves

---

## Architecture: Hexagonal (Ports & Adapters)

### Dependency rules

```
domain      ←  depends on nothing outside domain
application ←  depends on domain + ports only (never on adapters)
adapters    ←  depend on ports + domain
```

### Layer map

```
     ┌─────────────────────────────────────────┐
     │              driving adapters            │
     │   (Vue components, TimelineSlider, ...)  │
     └───────────────┬─────────────────────────┘
                     │ calls
     ┌───────────────▼─────────────────────────┐
     │            application/                  │
     │   usecases/   ◄──►   port/              │
     │  CalculateRecipe    FermentationPort     │
     │  PlanSchedule       TimePort             │
     └───────────────┬─────────────────────────┘
                     │ uses domain objects
     ┌───────────────▼─────────────────────────┐
     │               domain/                    │
     │  Recipe  BakingSchedule  IngredientList  │
     │  FermentationWindow  Loaf  Leavening     │
     └─────────────────────────────────────────┘
                     ▲
     ┌───────────────┴─────────────────────────┐
     │             driven adapters              │
     │  SameDayFermentationAdapter              │
     │  ColdRetardFermentationAdapter           │
     │  BrowserTimeAdapter                      │
     └─────────────────────────────────────────┘
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
interface TimePort {
  now(): Date
}
```

**Driving port** — use case exposes this to the outside world:

```ts
// application/port/RecipePresenter.ts
interface RecipePresenter {
  present(ingredients: IngredientList, schedule: BakingSchedule): void
}
```

### Use cases

```ts
// application/usecases/CalculateRecipe.ts
class CalculateRecipe {
  constructor(
    private fermentation: FermentationPort,
    private time: TimePort,
  ) {}
  execute(request: RecipeRequest): RecipeResponse { ... }
}

// application/usecases/PlanSchedule.ts
class PlanSchedule {
  constructor(private fermentation: FermentationPort, private time: TimePort) {}
  execute(bakeTime: Date, window: FermentationWindow): BakingSchedule { ... }
}
```

### Driven adapters

```ts
// adapters/driven/SameDayFermentationAdapter.ts
// implements FermentationPort — Arrhenius model

// adapters/driven/ColdRetardFermentationAdapter.ts
// implements FermentationPort — linear interpolation on cold retard table

// adapters/driven/BrowserTimeAdapter.ts
// implements TimePort — returns new Date()
```

### Driving adapters

Vue components are the driving adapters. They receive user events, construct
requests, call use cases, and render responses. They never touch domain objects
or ports directly.

---

## Object Model (domain)

Small objects playing roles, sending messages (Alan Kay OO). Strategy pattern
for fermentation — domain objects never know which strategy they're talking to
(that's the port's job).

```
FermentationWindow                    Recipe
  bulkHours: number    sends to ───►  ingredientsFor(loaves): IngredientList
  coldHours: number                   totalDoughWeight(): number
  doughTempC: number
  fridgeTempC: number

Loaf                        BakingSchedule
  finishedWeightG: number     events: ScheduleEvent[]
  hydration: number           starterFeedTime: Date
  leavening: Leavening

IngredientList
  rows: { name, grams, bakersPct }[]
```

---

## Testing Strategy

```
tests/
  domain/          — no doubles; domain objects talk to each other directly
  application/     — collaboration tests; ports are test doubles (stubs/spies)
  adapters/
    driven/        — contract tests; adapter must satisfy port contract
    driving/       — component tests; use cases are test doubles
```

**Domain tests** — pure behaviour, no doubles needed:
- `SameDayFermentation` and `ColdRetardFermentation` pinned to empirical tables
- `Recipe` tested with real `FermentationWindow` value objects

**Application tests** — collaboration via test doubles:
```ts
// CalculateRecipe.test.ts
const fermentation = {
  recommendStarterPct: vi.fn().mockReturnValue(0.10),
  buildSchedule: vi.fn().mockReturnValue(stubSchedule),
  describeMethod: vi.fn().mockReturnValue('Same-day'),
}
const time = { now: vi.fn().mockReturnValue(new Date('2026-04-13T09:00:00')) }
const useCase = new CalculateRecipe(fermentation, time)
// assert use case orchestrates correctly, not that math is right
```

**Adapter contract tests** — driven adapters prove they honour the port:
- `SameDayFermentationAdapter` passes the 12-point empirical table (±15%)
- `ColdRetardFermentationAdapter` passes the 3-point cold retard table (±20%)

---

## Starter % Model

**SameDayFermentationAdapter** — Arrhenius (R²=0.988):

    starterPct = clamp(283.03 / (hours^1.662 × exp(0.1295 × (tempC − 24))), 2, 40)

**ColdRetardFermentationAdapter** — linear interpolation on literature table:

| bulk (24°C) | cold retard (4°C) | starter % |
|-------------|-------------------|-----------|
| 2–4 h       | 8–12 h            | 7–10%     |
| 2–4 h       | 12–24 h           | 5–8%      |
| 2–4 h       | 24–48 h           | 3–5%      |

---

## Project Structure

    src/
      domain/
        FermentationWindow.ts         # value object
        Loaf.ts                       # value object
        Leavening.ts                  # value object / enum
        Recipe.ts                     # rich domain object
        BakingSchedule.ts             # value object
        IngredientList.ts             # value object
      application/
        port/
          FermentationPort.ts         # driven port
          TimePort.ts                 # driven port
          RecipePresenter.ts          # driving port
        usecases/
          CalculateRecipe.ts
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
        FermentationWindow.test.ts
      application/
        usecases/
          CalculateRecipe.test.ts     # ports are test doubles
          PlanSchedule.test.ts
      adapters/
        driven/
          SameDayFermentationAdapter.test.ts   # contract vs empirical table
          ColdRetardFermentationAdapter.test.ts
    index.html
    package.json
    vite.config.ts

---

## Stack

- **Vue 3** — Composition API + `<script setup>`
- **TypeScript**
- **Vite** — static build, zero backend
- **Vitest** — unit + contract tests
- **Tailwind CSS** — styling
- Deploy: GitHub Pages, Netlify, or Cloudflare Pages

---

## Resolved decisions

| # | Decision |
|---|---|
| 1 | Salt %: advanced override (1.8–2.2%), excluded from scheduling math |
| 2 | Fresh yeast: included in v1 at 3× instant yeast amount |
| 3 | Starter hydration: default 100%, override in advanced section |
| 4 | Starter % model: Arrhenius for same-day; linear interpolation for cold retard |
| 5 | Timeline: real clock times, browser local timezone |
| 6 | Dough temperature: default 24°C, override in advanced section |
| 7 | Architecture: Hexagonal (Ports & Adapters) |
| 8 | OO style: Alan Kay — small objects, rich domain, message passing |
| 9 | Test doubles: used only at application layer for port collaborators |
