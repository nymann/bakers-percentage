# Change Loaf Count

## Scenario

```gherkin
Given the app is showing a recipe for 1 loaf at 800g
When the user changes loaf count to 2
Then the total ingredient weights double
And the per-loaf weights remain unchanged
And the finished weight per loaf still shows 800g
```
