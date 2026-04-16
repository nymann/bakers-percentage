# Colored Zone Bands Render on Track

## Scenario

```gherkin
Given the editorial Planning view is open with sourdough leavening and the timeline rendered
When the timeline track is inspected
Then a region with role "presentation" labeled "Fermentation zones" contains three child elements
And one child has accessible name matching "green" / "ideal" / "safe"
And one child has accessible name matching "yellow" / "cautionary"
And one child has accessible name matching "red" / "unsafe"
And the band boundaries (in hours) match those returned by `useFermentationZone` for the current dough temperature and hydration
```
