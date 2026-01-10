# Fixtures

This directory contains custom Playwright fixtures.

## test.fixtures.ts

Provides page object fixtures that automatically inject page objects into tests:
- `homePage`: Instance of HomePage
- `loginPage`: Instance of LoginPage
- `productsPage`: Instance of ProductsPage

## Usage

Import the test and expect from fixtures instead of @playwright/test:

```typescript
import { test, expect } from "../fixtures/test.fixtures";

test("Example test", async ({ homePage }) => {
    await homePage.navigateToHomePage();
});
```

