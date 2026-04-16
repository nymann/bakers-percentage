# Mobile Renders Bottom Nav

## Scenario

```gherkin
Given the `editorial-shell` flag is ON
And the viewport is narrower than the `lg` breakpoint (1024px)
When the app renders
Then the bottom navigation bar is visible with all three tabs
And the desktop side nav bar is not visible
And clicking a tab in the bottom nav switches the active view
```
