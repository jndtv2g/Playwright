import { Page, expect } from "@playwright/test";
import { KlaviyoPopup } from "../components/KlaviyoPopup";
import { RegionDetectionPopup } from "../components/RegionDetectionPopup";

/**
 * Base Page class that contains common functionality for all page objects
 */
export class BasePage {
    protected page: Page;
    protected baseURL: string = "https://www.showpo.com/";
    protected klaviyoPopup: KlaviyoPopup;
    protected regionDetectionPopup: RegionDetectionPopup;

    constructor(page: Page) {
        this.page = page;
        this.klaviyoPopup = new KlaviyoPopup(page);
        this.regionDetectionPopup = new RegionDetectionPopup(page);
    }

    /**
     * Navigate to a specific URL
     * Automatically dismisses popups after navigation for a robust testing experience
     * @param url The URL to navigate to
     * @param options Navigation options including whether to dismiss popups
     */
    async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle', dismissPopups?: boolean }): Promise<void> {
        await this.page.goto(url, { waitUntil: options?.waitUntil || 'domcontentloaded' });
        
        // Automatically dismiss popups after navigation (default: true)
        if (options?.dismissPopups !== false) {
            await this.dismissAllPopups();
        }
    }

    /**
     * Get the current page title
     */
    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    /**
     * Verify page title contains text
     */
    async verifyTitle(expectedTitle: string | RegExp): Promise<void> {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    /**
     * Verify current URL
     */
    async verifyURL(urlPattern: string | RegExp): Promise<void> {
        await expect(this.page).toHaveURL(urlPattern);
    }

    /**
     * Wait for URL to match pattern
     */
    async waitForURL(urlPattern: string | RegExp): Promise<void> {
        await this.page.waitForURL(urlPattern);
    }

    /**
     * Click on an element
     */
    async click(selector: string): Promise<void> {
        await this.page.click(selector);
    }

    /**
     * Fill an input field
     */
    async fill(selector: string, value: string): Promise<void> {
        await this.page.fill(selector, value);
    }

    /**
     * Get text content of an element
     */
    async getText(selector: string): Promise<string> {
        return await this.page.textContent(selector) || '';
    }

    /**
     * Dismiss Klaviyo popup if it appears
     * This method is robust and tries multiple strategies to ensure the popup is dismissed
     * without interfering with other elements that need to be validated
     */
    async dismissKlaviyoPopup(): Promise<void> {
        await this.klaviyoPopup.dismiss();
    }

    /**
     * Wait for Klaviyo popup to appear and then dismiss it
     * Useful when you know a popup will appear after a specific action
     * @param timeout Maximum time to wait for popup to appear (default: 5000ms)
     */
    async waitAndDismissKlaviyoPopup(timeout: number = 5000): Promise<void> {
        await this.klaviyoPopup.waitAndDismiss(timeout);
    }

    /**
     * Dismiss region detection popup if it appears
     * This method is robust and tries multiple strategies to ensure the popup is dismissed
     * without interfering with other elements that need to be validated
     */
    async dismissRegionDetectionPopup(): Promise<void> {
        await this.regionDetectionPopup.dismiss();
    }

    /**
     * Wait for region detection popup to appear and then dismiss it
     * Useful when you know a popup will appear after a specific action
     * @param timeout Maximum time to wait for popup to appear (default: 5000ms)
     */
    async waitAndDismissRegionDetectionPopup(timeout: number = 5000): Promise<void> {
        await this.regionDetectionPopup.waitAndDismiss(timeout);
    }

    /**
     * Dismiss all common popups (Klaviyo and Region Detection)
     * Useful to call at the start of tests or after navigation
     */
    async dismissAllPopups(): Promise<void> {
        await this.dismissKlaviyoPopup();
        await this.dismissRegionDetectionPopup();
    }

    /**
     * Run a validation/action while continuously checking for and dismissing popups
     * This ensures popups don't interfere with test validations
     * @param action The validation or action to execute
     * @param options Configuration options
     * @returns The result of the action
     */
    async runWithPopupDismissal<T>(
        action: () => Promise<T>,
        options?: {
            checkInterval?: number; // How often to check for popups (default: 500ms)
            maxDuration?: number; // Maximum duration to run (default: 10000ms)
            dismissBeforeAction?: boolean; // Dismiss popups before starting (default: true)
            dismissAfterAction?: boolean; // Dismiss popups after completion (default: true)
        }
    ): Promise<T> {
        const {
            checkInterval = 500,
            maxDuration = 10000,
            dismissBeforeAction = true,
            dismissAfterAction = true
        } = options || {};

        // Dismiss popups before starting
        if (dismissBeforeAction) {
            await this.dismissAllPopups();
        }

        const startTime = Date.now();
        let popupCheckInterval: NodeJS.Timeout | null = null;
        let actionCompleted = false;
        let actionResult: T;
        let actionError: Error | null = null;

        // Start continuous popup checking in the background
        const startPopupChecking = () => {
            popupCheckInterval = setInterval(async () => {
                if (!actionCompleted && (Date.now() - startTime) < maxDuration) {
                    await this.dismissAllPopups();
                } else {
                    if (popupCheckInterval) {
                        clearInterval(popupCheckInterval);
                        popupCheckInterval = null;
                    }
                }
            }, checkInterval);
        };

        try {
            // Start popup checking
            startPopupChecking();

            // Execute the action
            actionResult = await action();
            actionCompleted = true;

            // Stop popup checking
            if (popupCheckInterval) {
                clearInterval(popupCheckInterval);
            }

            // Dismiss popups after action
            if (dismissAfterAction) {
                await this.dismissAllPopups();
            }

            return actionResult;
        } catch (error) {
            actionCompleted = true;
            actionError = error as Error;

            // Stop popup checking
            if (popupCheckInterval) {
                clearInterval(popupCheckInterval);
            }

            // Dismiss popups even on error
            await this.dismissAllPopups();

            throw actionError;
        }
    }

    /**
     * Run multiple validations/actions while continuously checking for popups
     * Useful when you have multiple validation steps
     * @param actions Array of validation/action functions to execute
     * @param options Configuration options
     */
    async runValidationsWithPopupDismissal(
        actions: Array<() => Promise<void>>,
        options?: {
            checkInterval?: number;
            maxDuration?: number;
            dismissBetweenActions?: boolean; // Dismiss between each action (default: true)
        }
    ): Promise<void> {
        const {
            checkInterval = 500,
            maxDuration = 30000,
            dismissBetweenActions = true
        } = options || {};

        const startTime = Date.now();
        let popupCheckInterval: NodeJS.Timeout | null = null;
        let allActionsCompleted = false;

        // Start continuous popup checking
        const startPopupChecking = () => {
            popupCheckInterval = setInterval(async () => {
                if (!allActionsCompleted && (Date.now() - startTime) < maxDuration) {
                    await this.dismissAllPopups();
                } else {
                    if (popupCheckInterval) {
                        clearInterval(popupCheckInterval);
                        popupCheckInterval = null;
                    }
                }
            }, checkInterval);
        };

        try {
            // Dismiss popups before starting
            await this.dismissAllPopups();

            // Start popup checking
            startPopupChecking();

            // Execute all actions
            for (let i = 0; i < actions.length; i++) {
                await actions[i]();

                // Dismiss popups between actions if enabled
                if (dismissBetweenActions && i < actions.length - 1) {
                    await this.dismissAllPopups();
                    await this.page.waitForTimeout(200); // Small delay between actions
                }
            }

            allActionsCompleted = true;

            // Stop popup checking
            if (popupCheckInterval) {
                clearInterval(popupCheckInterval);
            }

            // Final dismissal
            await this.dismissAllPopups();
        } catch (error) {
            allActionsCompleted = true;

            // Stop popup checking
            if (popupCheckInterval) {
                clearInterval(popupCheckInterval);
            }

            // Dismiss popups on error
            await this.dismissAllPopups();

            throw error;
        }
    }
}

