# Frontend Agent Flow: BDD Scenario to Shippable Deployment

Source: NotebookLM synthesis of GOOS, Atomic Design, Continuous Delivery, Headless Component patterns, and framework composables/hooks docs.

## Port–Adapter Split Across Frameworks

The architecture separates the **brain** (stateful logic — the port) from the **looks** (visual rendering — the adapter). Every modern framework has its own realization:

| Framework | **Port (Brain)** | **Adapter (Looks)** |
| :--- | :--- | :--- |
| Vue | Composable (Composition API) | Template (HTML bindings) |
| React | Custom Hook | JSX View |
| Svelte | Store / runes | Markup |
| Angular | Signal / Service | Template |

The protocol is always the shape and behavior of the object returned by the port — reactive variables and intention-revealing methods. The testing strategy is architecturally identical: verify the port headlessly (invoke methods, observe state), verify the adapter through the Window Driver (Testing Library queries by role/label).

**Framework-specific testing note:** Vue refs can be observed directly (`.value`). React hooks are tied to the render cycle and require `renderHook`/`act`. The Window Driver's polling/probing (`waitFor`, `findBy`) handles async state stabilization regardless of the underlying reactivity model.

## Sequence

1. **Consume** BDD scenario + design tokens (style tiles).
2. **Toggle** a feature flag on trunk.
3. **Write** a failing end-to-end acceptance test.
4. **TDD** the state hook logic with unit tests.
5. **Apply** tokens and wire components into the template.
6. **Push** to the deployment pipeline for CI/CD.

## 1. Artifact Consumption

The agent consumes:
- The **BDD scenario** as executable specification.
- The **Atomic Design pattern library** (atoms, molecules, organisms) for reusable building blocks.
- **Style tiles / element collages** to extract design tokens if new visual styles are needed.

## 2. Feature Flags and Trunk Entry

Before writing feature logic:
- Implement a **feature flag** or feature hiding (e.g., separate URI root like `/hotel`).
- Develop on **trunk** (mainline), commit at least once a day.
- Incomplete UI is integrated and tested for regressions but not visible to users.

**Full flag lifecycle:**
1. **Create:** Agent toggles flag on before writing any feature code. System remains always releasable.
2. **Develop:** Agent writes tests for the new behavior behind the flag. The acceptance gate runs with the flag enabled in a production-like environment.
3. **Flip:** Decision to expose the feature to users is a **human judgment** — made after a successful showcase or manual UAT, not by the agent.
4. **Remove:** Once the feature is verified in production, the agent performs a final **refactoring pass** to remove flag logic and the old code path. The flag is a temporary abstraction layer, not permanent infrastructure.

This replaces long-lived feature branches — the agent integrates daily and discovers conflicts early through the deployment pipeline.

## 3. Test-Driven Cycle

Nested loop strategy:
- **Outer loop (acceptance test):** Failing automated test from BDD scenario. Exercises the system end-to-end.
- **Inner loop (unit tests):** Rapid cycle testing individual state hooks/components. Pull required services into existence by mocking dependencies that don't yet exist.

### Window Driver Pattern (Testing Architecture)

The acceptance test stack, from domain language down to implementation:

```
BDD Scenario (domain language)
  ↓
Page Object / Test Helper (maps domain actions to queries)
  ↓
Testing Library (the Window Driver — queries by role/label)
  ↓
Template / JSX (the adapter)
  ↓
State Hook (the port)
```

- The **Window Driver** is discovered during step 3: as the agent writes the failing acceptance test, it "pulls" driver methods into existence based on what the user needs to do.
- **Testing Library** serves as the Window Driver for web — `getByRole`, `getByLabelText` query by accessible semantics, not implementation details.
- **Page Objects / Test Helpers** map domain language ("user places an order") to Testing Library queries. If the template changes visually, only the page object updates — BDD scenarios stay intact.
- The driver is implemented alongside the template in step 4/5.
- For async UI, the driver uses polling/probes (Testing Library's `waitFor`, `findBy`) to wait for stable state before asserting.

### Scenario Ordering: Happy Path First, Then Edge Cases

Each distinct state variation (error, loading, empty, edge case) is a **separate pass** through the outer red-green loop — not crammed into the template wiring of the success scenario.

1. **First pass:** Simplest success case (happy path). Establishes core wiring between state hook (port) and template (adapter).
2. **Subsequent passes:** Each error/loading/edge-case scenario gets its own failing acceptance test → TDD state hook → wire template cycle.
3. **Completion:** Feature is "finished" only when every identified scenario has its own green pass.

This follows North's principle: "a story's behaviour is simply its acceptance criteria." Each state variation that the system must handle is a behaviour that warrants its own scenario (Given-When-Then).

### Pseudo-patterns as Test Fixtures

Atomic Design's pseudo-patterns and Testing Library's render-in-state approach connect directly:

- **Pseudo-pattern (the "Given"):** JSON data variants (`dashboard~admin.json`, `dashboard~loading.json`, `dashboard~empty.json`) populate a template skeleton to test how it adapts to different content states. No new template code needed.
- **Testing Library (the "Verify"):** Render the component with the pseudo-pattern data as props/mock state, assert behaviour by role/label (e.g., `role="alert"` when error state is active).
- **The connection:** The agent uses pseudo-pattern JSON as input for Testing Library tests, verifying the template (adapter) handles all signals from the state hook (port).

### Error, Loading, and Empty States

Each state variation is an incremental behavioral extension layered onto the happy-path skeleton via separate scenario passes.

**Sequence — success first, then sad paths:**
1. **First pass:** Main success scenario establishes core wiring between state hook and template.
2. **Subsequent passes:** Each loading/error/empty state is a distinct Given-When-Then scenario with its own failing acceptance test → TDD state hook → wire template cycle.
3. **Not shippable** until every identified state variation has its own green pass.

**Pulling state into existence incrementally.** The state hook does not expose `loading`, `error`, etc. upfront. When building the "loading" scenario, the agent writes a test as if `loading` already exists in the return object — it fails, pulling it into the protocol. The hook returns a plain object of reactive state (`{ data, loading, error }`); the template binds to these signals.

**Pseudo-patterns bridge state and rendering.** Each state gets its own pseudo-pattern JSON fixture (`dashboard~loading.json`, `dashboard~error.json`). These provide the "Given" for template tests — verify the template shows a spinner when `loading` is true, an alert when `error` contains a message. The pseudo-pattern defines the expected content structure; the live state hook eventually provides the matching reactive signal.

**Signal vs. render — brain vs. looks:**
- **State hook (signal):** Handles the *what* — "I am fetching data." Exposes state via reactive protocol.
- **Template (render):** Handles the *how* — "If fetching, show `<LoadingSpinner />`."
- **Decoupled:** Swapping a spinner for a skeleton screen changes only the template. The state hook is untouched.

### Component Reuse vs. Creation

The agent navigates reuse-or-create decisions using client-driven interface discovery and incremental design.

**Consult the library first.** The pattern library is the agent's vocabulary. Before implementing UI, check whether an existing atom or molecule fulfills the **role** required by the scenario. GOOS says an object should describe what it wants from a neighbor in terms of the role that neighbor plays — if a "Primary Action Button" already exists and fits, reuse it.

**Pull new components into existence through failure.** If no library component fits the behavioral need, the agent writes the template test (via the Window Driver) *as if* the component exists. The test fails, and the component is discovered from the client's perspective — ensuring it provides exactly what the template needs, nothing more.

**Start inline, extract on duplication.** To avoid premature abstraction:
1. Implement with specific inline HTML or basic atoms — solve the present-day problem only.
2. Extract a molecule or organism only when duplication appears across templates (three strikes rule).
3. Extraction is refactoring — it evolves the pattern library incrementally, raising abstraction only when justified.

**No hooks, no speculation.** The agent ignores potential future features. The Atomic Design hierarchy (atoms → molecules → organisms) is a mental model for concurrent UI and design-system evolution, not a rigid upfront taxonomy. "Waiting to make abstractions will enable you to create designs that are simpler and more powerful."

### Slicing: How Thin is Thin Enough?

The agent targets slices that are end-to-end verifiable and completable in hours, not days.

**Signals to slice thinner:**
- The scenario is hard to estimate — hidden complexity.
- Infrastructure wiring (state hook ↔ server) is unproven — needs a walking skeleton first.
- The description uses "and" or "or" — multiple behaviors bundled together.

**The BDD scenario is the natural slice boundary** — a vertical stripe from user event through state hook to server response. Not one hook per slice (horizontal), but one scenario per slice (vertical). Template variations (loading, error, empty) are incremental passes that fatten the skeleton, not independent slices.

**Decomposing multi-hook scenarios (e.g., validate + submit + confirm):**
1. **Walking skeleton:** Thinnest end-to-end path — one input, one button, a server handshake. Proves infrastructure.
2. **Success stripe:** Happy path wiring validation and submission hooks together.
3. **Fatten:** Add sad paths (validation failure, network error) one scenario at a time.
4. **Interface discovery:** Mock collaborating hooks in tests to pull their interfaces into existence before implementing internals.

**Walking skeleton as agent foundation.** The skeleton flushes out technical uncertainty early, keeps the agent never more than minutes from a working integrated build, and avoids Big Design Up Front — only the smallest whiteboard-level decisions needed to kick-start the TDD cycle.

### Port–Adapter Boundary Protocol

The state hook's return object is a formal **communication protocol** — not just an interface shape but a reactive behavioral contract.

**What constitutes the protocol:**
- **Interface shape:** The returned reactive state and methods (e.g., `return { isOpen, toggleDropdown }`).
- **Reactive contract:** Expected state transitions. The template binds with the expectation that calling `toggleDropdown()` flips `isOpen`. GOOS distinguishes protocol (how components *work together*) from interface (whether they *fit together*) — the reactive contract is the protocol.

**Embrace reactivity as part of the port contract.** State hooks encapsulate stateful logic — reactivity is the mechanism, not an implementation detail to hide. Test hooks headlessly: invoke public methods, observe state changes in the returned object. This verifies the "brain" independently of the "looks."

**Pull new state into existence through tests.** When the template needs a new piece of state (`loading`) or action (`reset`), the agent follows GOOS interface discovery:
1. Write the test as if the property already exists on the return object.
2. The test fails — the requirement is now "pulled" into the hook's contract.
3. Implement the minimal internal logic to satisfy it.

**Tell, Don't Ask.** The state hook exposes intention-revealing methods (`joinAuction()`) not raw setters (`setStatus('bidding')`). The template tells the hook what the user did; the hook updates internal state; the template reflects it. This prevents the adapter from reaching into implementation details.

### Server Boundary (Ports, Adapters, and Fakes)

The state hook interacts with external APIs through an adapter layer, not directly via `fetch` or `axios`.

**Adapter layer:** The agent "pulls" a service interface into existence (e.g., `AuctionHouse`) during TDD. A thin adapter (e.g., `HttpAuctionHouse`) handles the HTTP client specifics. The state hook (port) depends on the interface, never on the transport.

**Testing at the boundary:**
- **Acceptance tests (outer loop):** Exercise the full vertical slice using a **fake server / stub** that provides a controllable environment. The test proves the scenario works end-to-end without depending on a live backend.
- **Focused integration tests:** Verify that the adapter correctly communicates with the real external API. These are fewer, slower, and run separately from the fast inner loop.

**Walking skeleton proves the round-trip.** The skeleton's primary purpose is validating infrastructure — that the state hook can call through the adapter, reach the server (or fake), and propagate the response back to the template. Business logic comes after the plumbing works.

### Accessibility: Behavioral Contract, Not Afterthought

Accessibility is stateful behavioral logic in the state hook and an enforced protocol in the template, verified through role-based testing in both loops.

**State hook owns accessibility logic.** The hook (brain) manages focus states, `aria-expanded` toggles, and keyboard events (arrow-key navigation, Enter selection). In the inner TDD loop, the agent verifies these state transitions headlessly — the component is accessible before it has a look.

**Window Driver as continuous accessibility audit.** Because acceptance tests interact with the system solely through the Window Driver (Testing Library queries by role/label), the agent *cannot pass its tests* with non-semantic markup. A `<div>` where a `<button>` is expected → the driver fails to find the element → automatic gate against inaccessible HTML.

**Extraction preserves semantics.** When refactoring inline HTML into a new atom/molecule, existing role-based tests enforce the contract. If a test expects `role="listbox"`, the extracted component must expose that role to stay green. Baking accessibility into the pattern library scales it — every template reusing the atom inherits its tested semantics.

**Async accessibility.** The Window Driver uses probes/polling (`waitFor`, `findByRole`) to wait for stable accessible state (e.g., `role="alert"` appearing) before asserting. Prevents flaky tests and ensures usability for assistive technologies that need stable state transitions.

### Design Tokens: Behavior First, Polish in Refactor

Design tokens are adapter-specific implementation details applied during the **Refactor** phase, not during Red/Green.

**Timing across the cycle:**
1. **Red/Green (behavior):** Agent implements structural markup and headless logic to pass the test. UI may be crude or unstyled.
2. **Refactor (tokens):** Once green, the agent refactors the component to consume design tokens (color, spacing, typography) from the pattern library. Structural markup first, then styling — the "prep chef" model.
3. **Template wiring (step 4):** Tokens are already baked into atoms/molecules when assembled into templates. Pseudo-patterns verify styled components handle content variations without breaking the design system.

**Why not earlier?** Tests that assert "button is blue" or "has class `btn-primary`" are brittle — they break on brand changes even when behavior is unchanged. The Window Driver absorbs token-level details: if the brand color changes, only the driver updates, not the test suite.

**Two kinds of assertion, two verification strategies:**
- **Behavioral (automated TDD):** Query by role and accessible name — `getByRole('button', { name: /join/i })`. Verifies what the system *does*.
- **Presentational (separate concern):** Visual consistency (brand colors, alignment) is verified outside TDD — via customer showcases, interface audits, or visual snapshot smoke tests that alert on unintended visual drift.

## 4. Component Assembly and Template Wiring

Russian nesting doll approach:
- **Wire template:** Define page's content structure (skeleton) using tokens already applied to atoms.
- **Pseudo-patterns:** Populate template with dynamic data (JSON) to create page variations testing different content states (empty, long text, etc.).

### Storybook as Living Showcase

Storybook is the pattern library's visual surface — the "watering hole" for cross-disciplinary review.

- **Customer showcase:** Stakeholders review look-and-feel and design atmosphere without a live backend. Serves as the venue for iteration demos.
- **Pseudo-pattern → story mapping:** Each pseudo-pattern JSON variant (`dashboard~loading.json`, `dashboard~error.json`) becomes a Storybook story. One story per state, directly mirroring the test fixtures.
- **Living documentation:** Generated as a static site, always in sync with production code. Runs alongside (not instead of) acceptance tests — Storybook shows the "looks," acceptance tests verify the "behavior."
- **Presentational review lives here.** Visual consistency, brand alignment, and design-system coherence are reviewed in Storybook — complementing the behavioral assertions in the automated test suite.

## 5. Deployment Pipeline

### Commit Stage (< 5 minutes)

Triggered on every push to trunk. Must be fast — this is the agent's immediate feedback loop.

- **Unit tests + code analysis:** Test coverage, duplication, cyclomatic complexity, code style.
- **Architectural checks:** Verify components consume pattern library tokens (no hardcoded values), detect usage of deprecated UI patterns.
- **Artifact creation:** Build JS/CSS bundles exactly once. Store in artifact repository — every subsequent stage reuses these exact binaries. What is tested is what is shipped.
- **Storybook build:** Generate the static style guide as living documentation, available to all stakeholders immediately.

### Acceptance Stage

Pipeline automatically promotes commit-stage artifacts to a **production-like environment**.

- **BDD scenario execution:** Acceptance tests (via Window Driver) interact with the deployed application as a user would — full end-to-end through the real UI.
- **Environment:** External server APIs replaced by **test doubles/stubs** for controllable, reproducible conditions (including sad paths like 500 errors).
- **Feature flag state:** Tests run with the flag **enabled** to verify the new feature works. The flag remains off for the general public — incomplete work is never exposed.
- **Visual regression + accessibility audits:** Run as separate parallel jobs. Visual snapshots catch unintended design drift; automated accessibility checks enforce semantic compliance. These complement (not replace) the behavioral acceptance tests.

### No Broken Trunk

- **Stop the line:** If any stage fails, the team owns the failure and fixes it immediately. A broken pipeline blocks all other work.
- **Feature hiding enforced:** The pipeline verifies that incomplete work is hidden via flags or separate URI roots. The agent integrates daily into trunk without breaking the existing user experience.

### "Deployment is a Non-Event"

- **Push-button promotion:** A build that passes all stages can be deployed to production via a single action — either automated (continuous deployment) or human-approved after a manual showcase.
- **Human judgment for subjective quality:** In most cases, a stakeholder reviews the showcase in staging to judge design atmosphere and polish before approving the release.
- **Zero-downtime rollback:** Blue-green deployments or canary releases. If a critical issue surfaces, the router switches back to the previous known-good version in seconds.
