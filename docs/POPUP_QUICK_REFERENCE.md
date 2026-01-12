# Popup Handling Quick Reference

## Quick Start

### ✅ Automatic (Easiest - Recommended)

```typescript
// Just use navigation methods - popups are dismissed automatically!
await homePage.navigateToHomePage();
await homePage.goToLoginPage();
await productsPage.navigateToProductsPage();
```

### Manual Dismissal

```typescript
// Dismiss all popups
await pageObject.dismissAllPopups();

// Dismiss specific popups
await pageObject.dismissKlaviyoPopup();
await pageObject.dismissRegionDetectionPopup();

// Wait for popup then dismiss
await pageObject.waitAndDismissKlaviyoPopup(5000);
await pageObject.waitAndDismissRegionDetectionPopup(5000);
```

## Common Patterns

### After Navigation
```typescript
await homePage.navigateToHomePage(); // Auto-dismissed
// Optional: dismiss again if popups appear with delay
await homePage.dismissAllPopups();
```

### After Login/Authentication
```typescript
await loginPage.login(email, password);
await loginPage.dismissAllPopups(); // Important after auth
```

### Before Element Interactions
```typescript
await pageObject.dismissAllPopups();
await pageObject.click(buttonSelector);
```

### In beforeEach Hook
```typescript
test.beforeEach(async ({ homePage }) => {
    await homePage.dismissAllPopups();
});
```

## Available Methods

All page objects (HomePage, LoginPage, ProductsPage, etc.) have these methods:

- `dismissAllPopups()` - Dismisses both Klaviyo and Region Detection popups
- `dismissKlaviyoPopup()` - Dismisses only Klaviyo popup
- `dismissRegionDetectionPopup()` - Dismisses only Region Detection popup
- `waitAndDismissKlaviyoPopup(timeout)` - Waits for Klaviyo popup then dismisses
- `waitAndDismissRegionDetectionPopup(timeout)` - Waits for Region Detection popup then dismisses

## Helper Utility

For advanced scenarios:

```typescript
import { PopupHelper } from "../utils/popupHelper";

// Dismiss with retry
await PopupHelper.dismissAllPopupsWithRetry(homePage, 3, 1000);

// Dismiss after navigation
await PopupHelper.dismissPopupsAfterNavigation(homePage, 2000);

// Dismiss before action
await PopupHelper.dismissPopupsBeforeAction(homePage, async () => {
    // Your action here
});
```

## When to Use What

| Scenario | Solution |
|----------|----------|
| Normal navigation | Automatic (built-in) |
| After login | `dismissAllPopups()` |
| Before clicking elements | `dismissAllPopups()` |
| Popups with delay | `waitAndDismissKlaviyoPopup(5000)` |
| Persistent popups | `PopupHelper.dismissAllPopupsWithRetry()` |
| Global dismissal | `beforeEach` hook |
