# Page Objects

This directory contains the page object classes for testing the Automation Exercise site. All page objects extend `BasePage`, which handles common navigation and interaction patterns.

## What's Here

- **BasePage.ts**: Shared base class with common methods (navigation, clicking, filling fields, URL/title checks). All other pages inherit from this.

- **HomePage.ts**: Handles the homepage - navigating to it, jumping to login or products pages, and verifying you're actually on the home page.

- **LoginPage.ts**: Everything login-related. You can either use the quick `login()` method or break it down into individual steps (`enterEmail()`, `enterPassword()`, `clickLoginButton()`). Also includes verification that login succeeded.

- **ProductsPage.ts**: Product browsing and search functionality. Navigate to products, search for items, count results, and click specific products by index.

## How It Works

Page objects are automatically available in your tests through custom fixtures. Just import the test function from the fixtures file and the page objects are ready to use:

```typescript
import { test, expect } from "../fixtures/test.fixtures";

test("Sign in and browse products", async ({ homePage, loginPage, productsPage }) => {
    await homePage.navigateToHomePage();
    await homePage.goToLoginPage();
    await loginPage.login('email@example.com', 'password');
    await loginPage.verifyLoginSuccess();
    
    await homePage.goToProductsPage();
    await productsPage.searchProduct('shirt');
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
});
```

The fixtures handle creating and cleaning up page object instances, so you don't need to worry about that.

## Available Page Objects

- `homePage` - Home page navigation and verification
- `loginPage` - Login functionality and verification
- `productsPage` - Product browsing and search

All selectors are kept private within each page object, so if the site's UI changes, you only need to update the relevant page class and all tests using it will pick up the changes automatically.
