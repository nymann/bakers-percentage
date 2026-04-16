# Shell Flag Removed

## Scenario

```gherkin
Given stories 09 and 10 are merged and the editorial shell has been manually verified
When the `editorial-shell` key is removed from `createInMemoryFeatureFlags` in `src/App.tsx`
Then the app renders the editorial shell unconditionally
And no `useFeatureFlag('editorial-shell')` call sites remain
And a grep for `editorial-shell` returns zero hits outside git history
```
