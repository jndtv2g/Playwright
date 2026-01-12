# Popup Handling Guide

This guide explains how to implement robust popup dismissal in your Playwright tests.

## Overview

The test framework includes automatic popup dismissal for:
- **Klaviyo Popups**: Email subscription popups
- **Region Detection Popups**: Store region selection modals

## Automatic Popup Dismissal

### Built-in Navigation Methods

All navigation methods automatically dismiss popups:

```typescript
// Popups are automatically dismissed
await homePage.navigateToHomePage();
await homePage.goToLoginPage();
await homePage.goToProductsPage();
await productsPage.navigateToProductsPage();
```

### How It Works

1. Navigation methods call `goto()` which automatically dismisses popups
2. Additional dismissal is performed after navigation to catch delayed popups
3. No manual intervention needed in most cases

## Manual Popup Dismissal

### Basic Usage

```typescript
// Dismiss all popups
await homePage.dismissAllPopups();

// Dismiss specific popups
await homePage.dismissKlaviyoPopup();
await homePage.dismissRegionDetectionPopup();
```

### Wait and Dismiss Pattern

Use when you know a popup will appear but need to wait for it:

```typescript
// Wait up to 5 seconds for popup to appear, then dismiss
await homePage.waitAndDismissKlaviyoPopup(5000);
await homePage.waitAndDismissRegionDetectionPopup(5000);
```

## Implementation Patterns

### Pattern 1: Automatic (Recommended)

Navigation methods handle popups automatically:

```typescript
test("My test", async ({ homePage }) => {
    await homePage.navigateToHomePage(); // Popups dismissed automatically
    await homePage.verifyOnHomePage();
});
```

### Pattern 2: After Actions

Dismiss popups after actions that might trigger them:

```typescript
test("Login test", async ({ homePage, loginPage }) => {
    await homePage.navigateToHomePage();
    await homePage.goToLoginPage();
    
    // Dismiss popups after login action
    await loginPage.login(email, password);
    await loginPage.dismissAllPopups();
    
    await loginPage.verifyLoginSuccess();
});
```

### Pattern 3: Before Validations

Dismiss popups before critical element interactions:

```typescript
test("Product search", async ({ productsPage }) => {
    await productsPage.navigateToProductsPage();
    
    // Dismiss popups before interacting with elements
    await productsPage.dismissAllPopups();
    
    await productsPage.searchProduct('dress');
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
});
```

### Pattern 4: Global Dismissal with beforeEach

Dismiss popups before each test:

```typescript
test.describe('My test suite', () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.dismissAllPopups();
    });

    test("Test 1", async ({ homePage }) => {
        // Popups already dismissed
        await homePage.navigateToHomePage();
    });
});
```

### Pattern 5: Using PopupHelper Utility

For advanced scenarios, use the PopupHelper:

```typescript
import { PopupHelper } from "../utils/popupHelper";

test("Advanced popup handling", async ({ homePage }) => {
    await homePage.navigateToHomePage();
    
    // Dismiss with retry logic
    await PopupHelper.dismissAllPopupsWithRetry(homePage, 3, 1000);
    
    // Dismiss after navigation with custom wait
    await PopupHelper.dismissPopupsAfterNavigation(homePage, 2000);
    
    // Dismiss before action
    await PopupHelper.dismissPopupsBeforeAction(homePage, async () => {
        await homePage.verifyOnHomePage();
    });
});
```

## Best Practices

### ✅ DO

1. **Rely on automatic dismissal** for navigation methods
2. **Dismiss after login/authentication** actions
3. **Dismiss before element interactions** that might be blocked
4. **Use waitAndDismiss** when you know popups will appear with delay
5. **Dismiss before validations** to ensure elements are visible

### ❌ DON'T

1. **Don't dismiss unnecessarily** - only when needed
2. **Don't ignore errors** - handle popup dismissal failures gracefully
3. **Don't hardcode wait times** - use waitAndDismiss with appropriate timeouts
4. **Don't dismiss in loops** - use PopupHelper.dismissAllPopupsWithRetry instead

## Common Scenarios

### Scenario 1: Popup appears after page load

```typescript
await homePage.navigateToHomePage(); // Automatic dismissal
// If popup still appears, wait and dismiss
await homePage.waitAndDismissKlaviyoPopup(3000);
```

### Scenario 2: Popup appears after user action

```typescript
await loginPage.login(email, password);
// Dismiss popups that appear after login
await loginPage.dismissAllPopups();
```

### Scenario 3: Popup blocks element interaction

```typescript
// Dismiss before clicking/interacting
await pageObject.dismissAllPopups();
await pageObject.click(selector);
```

### Scenario 4: Multiple popups appear

```typescript
// Dismiss all at once
await pageObject.dismissAllPopups();
// Or with retry for persistent popups
await PopupHelper.dismissAllPopupsWithRetry(pageObject, 2, 1000);
```

## Troubleshooting

### Popups still appearing after dismissal

1. **Increase wait time**: Popups might appear with delay
   ```typescript
   await pageObject.page.waitForTimeout(2000);
   await pageObject.dismissAllPopups();
   ```

2. **Use retry logic**: Popups might reappear
   ```typescript
   await PopupHelper.dismissAllPopupsWithRetry(pageObject, 3, 1500);
   ```

3. **Wait and dismiss**: If you know popup will appear
   ```typescript
   await pageObject.waitAndDismissKlaviyoPopup(5000);
   ```

### Popups blocking element interactions

Always dismiss before critical interactions:

```typescript
await pageObject.dismissAllPopups();
await pageObject.click(importantButton);
```

## Examples

See `tests/PopupHandlingExamples.spec.ts` for comprehensive examples of all patterns.
