import { Page, expect } from "@playwright/test";

/**
 * Base Page class that contains common functionality for all page objects
 */
export class BasePage {
    protected page: Page;
    protected baseURL: string = "https://automationexercise.com/";

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a specific URL
     */
    async goto(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
        await this.page.goto(url, { waitUntil: options?.waitUntil || 'domcontentloaded' });
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
}

