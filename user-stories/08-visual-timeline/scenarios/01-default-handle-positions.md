# Default Handle Positions on Load

## Scenario

```gherkin
Given the app loads with sourdough selected
When the timeline renders
Then the bake handle is positioned at tomorrow 09:00
And the mix handle is positioned within the green zone
And the timeline spans 48 hours from now
```
