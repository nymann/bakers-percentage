# Frontend Ports & Adapters: Design Artifacts for Agent Consumption

Source: NotebookLM synthesis of GOOS, Atomic Design, and Vue Composables docs.

## The Model

- **Port (Vue Composable):** Encapsulates stateful logic, side effects, and business rules. Defines the contract — what data is available and what actions can be taken. Agnostic of HTML/CSS.
- **Adapter (Vue Template/Component):** Consumes the composable and maps reactive state and methods to UI elements.

## Concrete Artifacts a Designer Produces

### 1. Style Tiles and Element Collages
Instead of full page mockups, designers produce "style tiles" (color, typography, texture explorations) applied to "element collages" (UI components in isolation). Establishes design atmosphere without premature layout assumptions.

### 2. Content and Display Pattern Spreadsheets
A spreadsheet articulating which display patterns (organisms/molecules) appear in a template and what content patterns they contain. Defines relative hierarchy and the role each pattern plays. An agent can map this directly to template structure.

### 3. Template Variations (Visual BDD Equivalent)
Same skeleton, different representative data, proving the design holds up under different states:
- Given a first-time user, when they view the dashboard, then recent activity is suppressed.
- Given an admin user, when they view a page, then additional action buttons appear.

## GOOS: Protocol over Interface
The contract between design intent and implementation is not just an interface (what fits) but a protocol (how they work together). The template adapter should be built to satisfy the needs of the client. Advocates for a declarative layer describing what the code will do.

## Atomic Design: The Systematic Hierarchy as Contract
The design system itself is the contract — a living product underpinning both the pattern library and the application. The template defines where components live and what content they represent. Atoms/molecules define how they look.

## Agent Loop

1. **Outer Red:** Write acceptance test from BDD scenario.
2. **Inner Red:** Walking skeleton — dummy composable + bare template proving pipeline works.
3. **Inner Green:** Test-drive composable logic with unit tests.
4. **Outer Green:** Wire template to composable. Acceptance test passes.
5. **Refactor:** Extract smaller composables, clean up template.

## Keeping Shippable
- Thin slices: one small feature per loop.
- Branch by abstraction for major changes.
- Window Driver pattern insulates behavioral tests from visual changes.
