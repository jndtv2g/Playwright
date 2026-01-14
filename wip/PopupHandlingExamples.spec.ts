import { test, expect } from "../fixtures/test.fixtures";

/**
 * Examples of different patterns for handling popups in tests
 * This file demonstrates various robust approaches to popup dismissal
 */
test.describe('Popup Handling Examples', () => {
    
    /**
     * Pattern 1: Automatic dismissal via navigation methods
     * Popups are automatically dismissed when using navigation methods
     */
    test("Pattern 1: Automatic dismissal via navigation", async ({ homePage }) => {
        // Navigation methods automatically dismiss popups
        await homePage.navigateToHomePage(); // Popups dismissed automatically
        await homePage.verifyOnHomePage();
    });

    /**
     * Pattern 2: Explicit dismissal after specific actions
     * Use this when you know popups might appear after certain actions
     */
    test("Pattern 2: Explicit dismissal after actions", async ({ homePage, loginPage }) => {
        await homePage.navigateToHomePage();
        
        // After clicking a button that might trigger popups
        await homePage.goToLoginPage();
        
        // Explicitly dismiss popups after action
        await loginPage.dismissAllPopups();
        
        await loginPage.verifyOnLoginPage();
    });

    /**
     * Pattern 3: Wait and dismiss pattern
     * Use this when you know a popup will appear but need to wait for it
     */
    test("Pattern 3: Wait and dismiss pattern", async ({ homePage }) => {
        await homePage.navigateToHomePage();
        
        // Wait for popup to appear (up to 5 seconds) and then dismiss
        // Useful when popups appear with a delay
        await homePage.waitAndDismissKlaviyoPopup(5000);
        await homePage.waitAndDismissRegionDetectionPopup(5000);
        
        await homePage.verifyOnHomePage();
    });

    /**
     * Pattern 4: Dismiss specific popups individually
     * Use this when you need to handle specific popups differently
     */
    test("Pattern 4: Dismiss specific popups", async ({ homePage }) => {
        await homePage.navigateToHomePage();
        
        // Dismiss only Klaviyo popup
        await homePage.dismissKlaviyoPopup();
        
        // Dismiss only Region Detection popup
        await homePage.dismissRegionDetectionPopup();
        
        await homePage.verifyOnHomePage();
    });

    /**
     * Pattern 5: Using beforeEach hook for global popup dismissal
     * This ensures popups are dismissed before each test
     */
    test.describe('Pattern 5: Global popup dismissal', () => {
        test.beforeEach(async ({ homePage }) => {
            // Dismiss all popups before each test
            await homePage.dismissAllPopups();
        });

        test("Test with global popup dismissal", async ({ homePage }) => {
            await homePage.navigateToHomePage();
            await homePage.verifyOnHomePage();
        });
    });

    /**
     * Pattern 6: Dismiss popups before critical validations
     * Use this to ensure popups don't block element interactions
     */
    test("Pattern 6: Dismiss before validations", async ({ homePage, productsPage }) => {
        await homePage.navigateToHomePage();
        await homePage.goToProductsPage();
        
        // Dismiss popups before interacting with page elements
        await productsPage.dismissAllPopups();
        
        // Now safely interact with elements
        await productsPage.verifyOnProductsPage();
        
        // Dismiss again before getting product count (popups might reappear)
        await productsPage.dismissAllPopups();
        const productCount = await productsPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);
    });

    /**
     * Pattern 7: Dismiss popups in try-catch for robustness
     * Use this when you want to continue even if popup dismissal fails
     */
    test("Pattern 7: Robust dismissal with error handling", async ({ homePage }) => {
        await homePage.navigateToHomePage();
        
        // Try to dismiss popups, but don't fail the test if it fails
        try {
            await homePage.dismissAllPopups();
        } catch (error) {
            console.log('Popup dismissal failed, continuing test:', error);
        }
        
        await homePage.verifyOnHomePage();
    });

    /**
     * Pattern 8: Dismiss popups after page interactions
     * Use this when popups might appear after user interactions
     */
    test("Pattern 8: Dismiss after interactions", async ({ productsPage }) => {
        await productsPage.navigateToProductsPage();
        
        // Interact with page
        await productsPage.searchProduct('dress');
        
        // Dismiss popups that might appear after search
        await productsPage.dismissAllPopups();
        
        // Continue with validations
        const count = await productsPage.getProductCount();
        expect(count).toBeGreaterThan(0);
    });
});
