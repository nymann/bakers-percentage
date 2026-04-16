# Unused Tokens Pruned

## Scenario

```gherkin
Given the editorial flags are removed
When `tokens.ts` is audited
Then every exported token has at least one consumer in `src/`
And any token with zero references has been deleted
And the `architecture.test.ts` and depcruise checks remain green
```
