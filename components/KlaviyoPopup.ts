import { Page } from "@playwright/test";

/**
 * Klaviyo Popup Component
 * Handles interactions with Klaviyo email subscription popups
 */
export class KlaviyoPopup {
    private page: Page;

    // Common selectors for Klaviyo popup elements
    private readonly popupContainer: string = '[class*="kl-private-reset-css"], [class*="klaviyo"], [id*="klaviyo"]';
    private readonly closeButtonSelectors: string[] = [
        'button[aria-label*="Close" i]',
        'button[aria-label*="close" i]',
        '[aria-label*="Close" i]',
        '[aria-label*="close" i]',
        '[class*="close" i]',
        '[class*="Close"]',
        'button:has-text("×")',
        'button:has-text("✕")',
        'button:has-text("X")',
        '[data-testid*="close" i]',
        '[id*="close" i]',
        'svg[aria-label*="close" i]',
        '.klaviyo-close',
        '[class*="klaviyo-close" i]',
        '[role="button"][aria-label*="close" i]',
        // Common close button patterns in modals
        '[class*="modal-close"]',
        '[class*="popup-close"]',
    ];
    private readonly overlaySelector: string = '[class*="overlay" i], [class*="backdrop" i], [class*="modal-backdrop" i], [class*="klaviyo-overlay" i]';
    private readonly iframeSelector: string = 'iframe[src*="klaviyo" i], iframe[id*="klaviyo" i], iframe[class*="klaviyo" i]';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Check if the Klaviyo popup is visible
     */
    async isVisible(): Promise<boolean> {
        try {
            // Check in main page - look for popup container that's actually visible
            const popupLocators = this.page.locator(this.popupContainer);
            const count = await popupLocators.count();
            
            for (let i = 0; i < count; i++) {
                const popup = popupLocators.nth(i);
                const isVisible = await popup.isVisible({ timeout: 500 }).catch(() => false);
                if (isVisible) {
                    // Additional check: ensure it's not hidden by checking computed style
                    const display = await popup.evaluate((el) => {
                        const style = window.getComputedStyle(el);
                        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                    }).catch(() => false);
                    if (display) return true;
                }
            }

            // Check in iframe
            const iframeCount = await this.page.locator(this.iframeSelector).count();
            if (iframeCount > 0) {
                const iframe = this.page.frameLocator(this.iframeSelector).first();
                const popupInIframe = await iframe.locator(this.popupContainer).first().isVisible({ timeout: 500 }).catch(() => false);
                if (popupInIframe) return true;
            }

            return false;
        } catch {
            return false;
        }
    }

    /**
     * Dismiss the popup by clicking the close button
     */
    private async clickCloseButton(): Promise<boolean> {
        try {
            // Try to find and click close button in main page
            for (const selector of this.closeButtonSelectors) {
                const closeButton = this.page.locator(selector).first();
                const isVisible = await closeButton.isVisible({ timeout: 500 }).catch(() => false);
                if (isVisible) {
                    await closeButton.click({ timeout: 1000 });
                    // Wait a bit to ensure popup is dismissed
                    await this.page.waitForTimeout(300);
                    return true;
                }
            }

            // Try to find close button in iframe
            const iframes = await this.page.locator(this.iframeSelector).count();
            if (iframes > 0) {
                const iframe = this.page.frameLocator(this.iframeSelector).first();
                for (const selector of this.closeButtonSelectors) {
                    const closeButton = iframe.locator(selector).first();
                    const isVisible = await closeButton.isVisible({ timeout: 500 }).catch(() => false);
                    if (isVisible) {
                        await closeButton.click({ timeout: 1000 });
                        await this.page.waitForTimeout(300);
                        return true;
                    }
                }
            }

            return false;
        } catch {
            return false;
        }
    }

    /**
     * Dismiss the popup by clicking outside/on overlay
     */
    private async clickOverlay(): Promise<boolean> {
        try {
            // Try clicking overlay in main page
            const overlay = this.page.locator(this.overlaySelector).first();
            const isVisible = await overlay.isVisible({ timeout: 500 }).catch(() => false);
            if (isVisible) {
                await overlay.click({ position: { x: 10, y: 10 }, timeout: 1000 });
                await this.page.waitForTimeout(300);
                return true;
            }

            // Try clicking outside the popup container
            const popupContainer = this.page.locator(this.popupContainer).first();
            const isPopupVisible = await popupContainer.isVisible({ timeout: 500 }).catch(() => false);
            if (isPopupVisible) {
                // Get popup bounding box to click outside it
                const boundingBox = await popupContainer.boundingBox().catch(() => null);
                if (boundingBox) {
                    // Click to the left of the popup
                    await this.page.mouse.click(Math.max(10, boundingBox.x - 10), boundingBox.y + 10);
                    await this.page.waitForTimeout(300);
                    return true;
                } else {
                    // Fallback: click at a safe position (top-left corner)
                    await this.page.mouse.click(10, 10);
                    await this.page.waitForTimeout(300);
                    return true;
                }
            }

            return false;
        } catch {
            return false;
        }
    }

    /**
     * Dismiss the popup by pressing Escape key
     */
    private async pressEscape(): Promise<boolean> {
        try {
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(300);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Dismiss the popup using multiple strategies
     * Tries different methods in order until one succeeds
     * This method is designed to be non-intrusive and won't interfere with other page elements
     */
    async dismiss(): Promise<void> {
        // Check if popup is visible first
        const isPopupVisible = await this.isVisible();
        if (!isPopupVisible) {
            return; // Popup is not visible, nothing to dismiss
        }

        // Strategy 1: Try clicking close button (most reliable if available)
        const closeButtonClicked = await this.clickCloseButton();
        if (closeButtonClicked) {
            // Wait a moment and verify popup is dismissed
            await this.page.waitForTimeout(500);
            const stillVisible = await this.isVisible();
            if (!stillVisible) {
                return; // Successfully dismissed
            }
        }

        // Strategy 2: Try pressing Escape key (common for modals)
        await this.pressEscape();
        await this.page.waitForTimeout(500);
        const stillVisibleAfterEscape = await this.isVisible();
        if (!stillVisibleAfterEscape) {
            return; // Successfully dismissed
        }

        // Strategy 3: Try clicking overlay/outside (safe fallback)
        await this.clickOverlay();
        await this.page.waitForTimeout(500);
        const stillVisibleAfterOverlay = await this.isVisible();
        if (!stillVisibleAfterOverlay) {
            return; // Successfully dismissed
        }

        // Strategy 4: Try pressing Escape again (sometimes needs multiple presses)
        await this.pressEscape();
        await this.page.waitForTimeout(300);
        
        // Final check - if still visible, try one more safe click outside
        const finalCheck = await this.isVisible();
        if (finalCheck) {
            try {
                // Get viewport size and click at a safe edge position
                const viewport = this.page.viewportSize();
                if (viewport) {
                    // Click at top-left corner (safest position)
                    await this.page.mouse.click(5, 5);
                    await this.page.waitForTimeout(200);
                }
            } catch {
                // Ignore errors in last resort attempt - popup might be dismissed anyway
            }
        }
    }

    /**
     * Wait for popup to appear and then dismiss it
     */
    async waitAndDismiss(timeout: number = 5000): Promise<void> {
        try {
            // Wait for popup to appear
            await this.page.waitForSelector(this.popupContainer, { timeout, state: 'visible' }).catch(() => {
                // Popup didn't appear, that's fine
            });
            
            // Small delay to ensure popup is fully rendered
            await this.page.waitForTimeout(500);
            
            // Dismiss the popup
            await this.dismiss();
        } catch {
            // If popup doesn't appear or can't be dismissed, continue
        }
    }
}
