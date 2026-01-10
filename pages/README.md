# Page Objects

This directory contains all Page Object Model (POM) classes for the test suite.

## Structure

- **BasePage.ts**: Base class that contains common functionality for all page objects
- **HomePage.ts**: Page object for the home page
- **LoginPage.ts**: Page object for the login page
- **ProductsPage.ts**: Page object for the products page

## Usage

Page objects are automatically injected into tests via fixtures. See `fixtures/test.fixtures.ts` for details.

Example:
```typescript
test("Example test", async ({ homePage, loginPage }) => {
    await homePage.navigateToHomePage();
    await homePage.goToLoginPage();
    await loginPage.login('email@example.com', 'password');
});
```

