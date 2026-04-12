# Reset Override to Recommended Values

## Scenario

```gherkin
Given the app has auto-recommended 10% starter with cold retard method
And the user has overridden starter % to 15%
When the user clicks "Use recommended"
Then the starter % reverts to the auto-recommended value (10%)
And the method reverts to cold retard
And the "Use recommended" link disappears
And the recommendation note no longer indicates a manual override
```
