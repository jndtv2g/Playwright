import { Page } from "@playwright/test";

/**
 * Region Detection Popup Component
 * Handles interactions with region detection modals/popups
 */
export class RegionDetectionPopup {
    private page: Page;

    // Selectors for region detection popup elements
    private readonly popupContainer: string = '[role="dialog"][id^="radix-"]';
    private readonly popupByTitle: string = '[role="dialog"]:has-text("Region Detection")';
    private readonly stayOnCurrentStoreButton: string = 'button:has-text("No, Stay on current store"), button:has-text("Stay on current store")';
    private readonly changeStoreButton: string = 'button:has-text("Yes, Change store"), button:has-text("Change store")';
    private readonly closeButtonSelectors: string[] = [
        'button[aria-label*="Close" i]',
        'button[aria-label*="close" i]',
        '[aria-label*="Close" i]',
        '[aria-label*="close" i]',
        '[role="dialog"] button[class*="close" i]',
        '[role="dialog"] button:has-text("×")',
        '[role="dialog"] button:has-text("✕")',
        '[role="dialog"] button:has-text("X")',
    ];
    private readonly overlaySelector: string = '[class*="overlay" i], [class*="backdrop" i], [class*="modal-backdrop" i]';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Check if the region detection popup is visible
     */
    async isVisible(): Promise<boolean> {
        try {
            // Check for dialog with Region Detection title
            const popupByTitle = await this.page.locator(this.popupByTitle).isVisible({ timeout: 500 }).catch(() => false);
            if (popupByTitle) {
                // Additional check: ensure it's actually open (not closed)
                const dataState = await this.page.locator(this.popupByTitle).getAttribute('data-state').catch(() => null);
                if (dataState === 'open') return true;
            }

            // Check for dialog with radix ID pattern
            const popupContainer = this.page.locator(this.popupContainer);
            const count = await popupContainer.count();
            
            for (let i = 0; i < count; i++) {
                const popup = popupContainer.nth(i);
                const isVisible = await popup.isVisible({ timeout: 500 }).catch(() => false);
                if (isVisible) {
                    // Check if it contains "Region Detection" text
                    const hasRegionText = await popup.locator(':has-text("Region Detection")').count().catch(() => 0);
                    if (hasRegionText > 0) {
                        // Verify it's open
                        const dataState = await popup.getAttribute('data-state').catch(() => null);
                        if (dataState === 'open') {
                            // Additional check: ensure it's not hidden by checking computed style
                            const display = await popup.evaluate((el) => {
                                const style = window.getComputedStyle(el);
                                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                            }).catch(() => false);
                            if (display) return true;
                        }
                    }
                }
            }

            return false;
        } catch {
            return false;
        }
    }

    /**
     * Dismiss the popup by clicking "Stay on current store" button
     * This is the most common action users would take
     */
    private async clickStayOnCurrentStore(): Promise<boolean> {
        try {
            // Try to find the button in the dialog
            const dialog = this.page.locator(this.popupContainer).first();
            const stayButton = dialog.locator(this.stayOnCurrentStoreButton).first();
            
            const isVisible = await stayButton.isVisible({ timeout: 500 }).catch(() => false);
            if (isVisible) {
                await stayButton.click({ timeout: 1000 });
                await this.page.waitForTimeout(300);
                return true;
            }

            // Fallback: try finding button without dialog context
            const stayButtonGlobal = this.page.locator(this.stayOnCurrentStoreButton).first();
            const isVisibleGlobal = await stayButtonGlobal.isVisible({ timeout: 500 }).catch(() => false);
            if (isVisibleGlobal) {
                await stayButtonGlobal.click({ timeout: 1000 });
                await this.page.waitForTimeout(300);
                return true;
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
            const dialog = this.page.locator(this.popupContainer).first();
            
            // Try to find and click close button within the dialog
            for (const selector of this.closeButtonSelectors) {
                const closeButton = dialog.locator(selector).first();
                const isVisible = await closeButton.isVisible({ timeout: 500 }).catch(() => false);
                if (isVisible) {
                    await closeButton.click({ timeout: 1000 });
                    await this.page.waitForTimeout(300);
                    return true;
                }
            }

            // Try finding close button globally (but verify it's in a visible dialog)
            for (const selector of this.closeButtonSelectors) {
                const closeButton = this.page.locator(selector).first();
                const isVisible = await closeButton.isVisible({ timeout: 500 }).catch(() => false);
                if (isVisible) {
                    // Verify it's within a visible dialog by checking if dialog exists and is visible
                    const isInDialog = await closeButton.evaluate((el) => {
                        let parent = el.parentElement;
                        while (parent) {
                            if (parent.getAttribute('role') === 'dialog') {
                                const style = window.getComputedStyle(parent);
                                return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                            }
                            parent = parent.parentElement;
                        }
                        return false;
                    }).catch(() => false);
                    
                    if (isInDialog) {
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
            // Try clicking overlay
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

        // Strategy 1: Click "Stay on current store" button (most common user action)
        const stayButtonClicked = await this.clickStayOnCurrentStore();
        if (stayButtonClicked) {
            // Wait a moment and verify popup is dismissed
            await this.page.waitForTimeout(500);
            const stillVisible = await this.isVisible();
            if (!stillVisible) {
                return; // Successfully dismissed
            }
        }

        // Strategy 2: Try clicking close button
        const closeButtonClicked = await this.clickCloseButton();
        if (closeButtonClicked) {
            await this.page.waitForTimeout(500);
            const stillVisible = await this.isVisible();
            if (!stillVisible) {
                return; // Successfully dismissed
            }
        }

        // Strategy 3: Try pressing Escape key (common for modals)
        await this.pressEscape();
        await this.page.waitForTimeout(500);
        const stillVisibleAfterEscape = await this.isVisible();
        if (!stillVisibleAfterEscape) {
            return; // Successfully dismissed
        }

        // Strategy 4: Try clicking overlay/outside (safe fallback)
        await this.clickOverlay();
        await this.page.waitForTimeout(500);
        const stillVisibleAfterOverlay = await this.isVisible();
        if (!stillVisibleAfterOverlay) {
            return; // Successfully dismissed
        }

        // Strategy 5: Try pressing Escape again (sometimes needs multiple presses)
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
            // Wait for popup to appear - check for dialog with Region Detection
            await this.page.waitForSelector(this.popupByTitle, { timeout, state: 'visible' }).catch(() => {
                // Also try waiting for the generic dialog selector
                return this.page.waitForSelector(this.popupContainer, { timeout, state: 'visible' }).catch(() => {
                    // Popup didn't appear, that's fine
                });
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
