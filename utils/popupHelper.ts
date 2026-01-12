import { BasePage } from "../pages/BasePage";

/**
 * Helper utility for robust popup handling across tests
 * Provides common patterns and utilities for popup dismissal
 */
export class PopupHelper {
    /**
     * Dismiss all popups with retry logic
     * Useful when popups might appear multiple times or with delays
     * @param pageObject Any page object that extends BasePage
     * @param maxRetries Maximum number of retry attempts (default: 2)
     * @param retryDelay Delay between retries in milliseconds (default: 1000)
     */
    static async dismissAllPopupsWithRetry(
        pageObject: BasePage,
        maxRetries: number = 2,
        retryDelay: number = 1000
    ): Promise<void> {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            await pageObject.dismissAllPopups();
            
            // Wait a bit before next attempt
            if (attempt < maxRetries) {
                await pageObject.page.waitForTimeout(retryDelay);
            }
        }
    }

    /**
     * Dismiss popups after navigation
     * Waits for page to settle before dismissing popups
     * @param pageObject Any page object that extends BasePage
     * @param waitTime Time to wait for page to settle (default: 1000ms)
     */
    static async dismissPopupsAfterNavigation(
        pageObject: BasePage,
        waitTime: number = 1000
    ): Promise<void> {
        // Wait for page to settle using the page's waitForTimeout
        // Access page through a method that BasePage provides
        const page = (pageObject as any).page;
        if (page) {
            await page.waitForTimeout(waitTime);
        }
        
        // Dismiss all popups
        await pageObject.dismissAllPopups();
        
        // Wait a bit more for any delayed popups
        if (page) {
            await page.waitForTimeout(500);
        }
        await pageObject.dismissAllPopups();
    }

    /**
     * Dismiss popups before element interaction
     * Ensures popups don't block element interactions
     * @param pageObject Any page object that extends BasePage
     * @param action Callback function to execute after popup dismissal
     */
    static async dismissPopupsBeforeAction<T>(
        pageObject: BasePage,
        action: () => Promise<T>
    ): Promise<T> {
        await pageObject.dismissAllPopups();
        const result = await action();
        // Dismiss again after action in case popups appeared
        await pageObject.dismissAllPopups();
        return result;
    }

    /**
     * Wait for and dismiss popups with timeout
     * Useful when you know popups will appear but want to wait for them
     * @param pageObject Any page object that extends BasePage
     * @param timeout Maximum time to wait for popups (default: 5000ms)
     */
    static async waitAndDismissAllPopups(
        pageObject: BasePage,
        timeout: number = 5000
    ): Promise<void> {
        await Promise.all([
            pageObject.waitAndDismissKlaviyoPopup(timeout),
            pageObject.waitAndDismissRegionDetectionPopup(timeout)
        ]);
    }
}
