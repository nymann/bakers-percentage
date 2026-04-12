# Architecture Dependency Rules Enforced

## Scenario: Domain has no outward dependencies

```gherkin
Given the source files under src/domain/
When analyzing their imports
Then none of them import from src/application/
And none of them import from src/adapters/
```

## Scenario: Application depends only on domain and ports

```gherkin
Given the source files under src/application/
When analyzing their imports
Then they may import from src/domain/
And they may import from src/application/port/
And none of them import from src/adapters/
```

## Scenario: Adapters depend on ports and domain only

```gherkin
Given the source files under src/adapters/
When analyzing their imports
Then they may import from src/domain/
And they may import from src/application/port/
And none of them import from src/application/usecases/
```
