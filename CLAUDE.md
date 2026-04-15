# Baker's Percentage Calculator

## Implementing User Stories

Stories live in `user-stories/NN-name/user-story.md` with BDD scenarios in `user-stories/NN-name/scenarios/`.

Follow the agentic-flow frontend orchestration (`../agentic-flow/frontend/orchestration-flow.md`). Each BDD scenario is one pass through the loop.

### Scenario Ordering

Happy path first, then edge cases. Order by incremental complexity — each scenario should build on the prior one with minimal rework.

### Per-Scenario Loop

**Step 1 — Analyze Seam.** Check coverage/complexity of the hook and component being changed. If coverage is sufficient, skip Step 2.

**Step 2 — Ensure Test Safety.** Characterize existing behavior if the seam lacks coverage. Skip if the seam is already well-tested.

**Step 3 — Implement (TDD cycle):**

1. **3a — Failing acceptance test.** Write in the component test file using Testing Library. Query by role/label, not class or data attributes. Test must compile and fail on assertion.
2. **3b — Refactor collaborators.** Smell-check dependencies before implementing. Commit refactoring separately.
3. **3c — Hook unit tests.** Pull the interface into existence — write tests as if the hook already returns the right shape. Use `renderHook` + `act`. Tests fail with "property does not exist."
4. **3d — Implement hook.** Minimal code to make unit tests pass. Intention-revealing methods (Tell Don't Ask): `changeFinishedWeight(g)` not `setFinishedWeight(g)`.
5. **3e — Wire template.** Bind hook state to UI. Use design tokens, semantic HTML. Start inline — extract to design system on second use.
6. **3f — Verify.** Run full suite. Flag ON passes, flag OFF renders nothing, no regressions.

After each scenario, return to Step 1 for the next scenario.

### Architecture

```
src/
├── domain/           Pure TS, no framework deps. Business logic lives here.
├── application/
│   ├── ports/        Interfaces (e.g., FeatureFlagPort)
│   └── use-cases/    React hooks — the "brain." Orchestrate domain + ports.
├── adapters/
│   ├── driving/      React components — the "looks." Consume hooks.
│   └── driven/       External service implementations (e.g., InMemoryFeatureFlags)
└── design-system/    Tokens, atoms, molecules. No business logic deps.
```

- Domain concepts (types, pure functions) belong in `domain/`, not in hooks or components.
- Hooks return intention-revealing methods, not raw setters.
- Components depend on hooks through use-cases, never on each other.
- `architecture.test.ts` enforces boundaries — keep it green.

### Feature Flags

Every feature is gated by a flag in `feature-flags.tsx`. The flag name is a pre-flow decision. Tests verify both flag ON (feature works) and flag OFF (renders nothing).
