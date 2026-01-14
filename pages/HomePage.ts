import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { BASE_URL, SELECTORS } from "../utils/constants";

/**
 * Home Page Object Model
 */
export class HomePage extends BasePage {
    private loginButton: string = SELECTORS.loginButton;
    private productsButton: string = SELECTORS.productsButton;

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to the homepage
     * Automatically dismisses popups after navigation
     */
    async navigateToHomePage(): Promise<void> {
        await this.goto(BASE_URL);
        // Popups are automatically dismissed by goto(), but we wait a bit for any delayed popups
        await this.page.waitForTimeout(1000);
        await this.dismissAllPopups();
    }

    /**
     * Click on the 'Signup / Login' button
     * Dismisses popups after navigation if they appear
     */
    async goToLoginPage(): Promise<void> {
        await this.click(this.loginButton);
        // Wait for navigation and dismiss any popups that appear
        await this.page.waitForTimeout(500);
        await this.dismissAllPopups();
    }

    /**
     * Click on the 'Products' button
     * Dismisses popups after navigation if they appear
     */
    async goToProductsPage(): Promise<void> {
        await this.click(this.productsButton);
        // Wait for navigation and dismiss any popups that appear
        await this.page.waitForTimeout(500);
        await this.dismissAllPopups();
    }

    /**
     * Verify user is on home page
     */
    async verifyOnHomePage(): Promise<void> {
        await this.verifyTitle(/Showpo/);
        await this.verifyURL(/showpo.com/);
    }
}