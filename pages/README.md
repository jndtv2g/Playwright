# Page Objects

This directory contains all Page Object Model (POM) classes for the test suite. The Page Object Model is a design pattern that encapsulates web page elements and their interactions into reusable classes, promoting maintainability, readability, and reducing code duplication across tests.

## Architecture

The page objects follow an inheritance-based architecture where all specific page classes extend a common `BasePage` class. This design provides shared functionality while allowing each page to implement its own specific behaviors and interactions.

### Base Class

- **BasePage.ts**: The foundational class that provides common functionality shared across all page objects. It includes methods for navigation, element interaction (click, fill, getText), URL verification, and title validation. All page objects inherit from this base class to leverage these shared capabilities.

### Page Objects

- **HomePage.ts**: Encapsulates the home page functionality, including navigation to the homepage, transitioning to the login page, accessing the products page, and verifying the user's presence on the home page.

- **LoginPage.ts**: Manages all login-related interactions, including entering credentials, submitting login forms, verifying successful authentication, and validating that users are on the login page. Provides both high-level (single method) and granular (individual field) interaction methods.

- **ProductsPage.ts**: Handles product-related operations such as navigating to the products page, searching for products, retrieving product counts, and interacting with individual product items by index.

## Usage

Page objects are automatically injected into test functions through Playwright's custom fixtures mechanism. This eliminates the need for manual instantiation and ensures consistent page object initialization across all tests.

### Basic Example

```typescript
import { test, expect } from "../fixtures/test.fixtures";

test("Navigate and login", async ({ homePage, loginPage }) => {
    await homePage.navigateToHomePage();
    await homePage.goToLoginPage();
    await loginPage.login('email@example.com', 'password');
    await loginPage.verifyLoginSuccess();
});
```

### Advanced Example

```typescript
import { test, expect } from "../fixtures/test.fixtures";

test("Product search workflow", async ({ homePage, productsPage }) => {
    // Navigate through the application
    await homePage.navigateToHomePage();
    await homePage.goToProductsPage();
    
    // Verify navigation
    await productsPage.verifyOnProductsPage();
    
    // Perform product search
    await productsPage.searchProduct('shirt');
    
    // Validate results
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
});
```

### Granular Interaction Example

For scenarios requiring more control over individual steps:

```typescript
test("Step-by-step login", async ({ loginPage }) => {
    await loginPage.verifyOnLoginPage();
    await loginPage.enterEmail('user@example.com');
    await loginPage.enterPassword('securePassword123');
    await loginPage.clickLoginButton();
    await loginPage.verifyLoginSuccess();
});
```

## Fixtures Integration

Page objects are provided through custom fixtures defined in `fixtures/test.fixtures.ts`. The fixtures automatically create instances of each page object and make them available as test parameters. This approach ensures:

- Consistent page object initialization
- Automatic cleanup after tests
- Type safety through TypeScript
- Easy access to multiple page objects in a single test

Available fixtures:
- `homePage`: Instance of `HomePage`
- `loginPage`: Instance of `LoginPage`
- `productsPage`: Instance of `ProductsPage`

## Best Practices

1. **Use page objects for all interactions**: Avoid direct Playwright API calls in test files; route all interactions through page objects.

2. **Leverage base class methods**: Utilize inherited methods from `BasePage` for common operations like navigation and element interaction.

3. **Combine page objects**: Use multiple page objects in a single test to represent complex user workflows.

4. **Verify state**: Use verification methods (e.g., `verifyOnLoginPage()`, `verifyLoginSuccess()`) to ensure expected page states before proceeding with actions.

5. **Keep selectors private**: All element selectors are encapsulated as private properties within page objects, making maintenance easier when UI changes occur.

## Maintenance

When the application UI changes:
1. Update the relevant page object's selectors or methods
2. All tests using that page object will automatically benefit from the changes
3. No need to modify individual test files

This centralized approach significantly reduces maintenance overhead and ensures consistency across the test suite.
