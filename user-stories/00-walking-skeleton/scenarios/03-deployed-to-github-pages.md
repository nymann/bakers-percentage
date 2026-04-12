# Deployed to GitHub Pages

## Scenario: Push to main triggers deployment

```gherkin
Given a commit is pushed to the main branch
When the GitHub Actions workflow runs
Then the app is built as a static site via Vite
And the build output is deployed to GitHub Pages
And the app is accessible at the project's GitHub Pages URL
```

## Scenario: Build fails if tests fail

```gherkin
Given a commit with a failing test is pushed to main
When the GitHub Actions workflow runs
Then the tests run before the deploy step
And the workflow fails without deploying
```
