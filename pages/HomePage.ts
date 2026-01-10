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
     */
    async navigateToHomePage(): Promise<void> {
        await this.goto(BASE_URL);
    }

    /**
     * Click on the 'Signup / Login' button
     */
    async goToLoginPage(): Promise<void> {
        await this.click(this.loginButton);
    }

    /**
     * Click on the 'Products' button
     */
    async goToProductsPage(): Promise<void> {
        await this.click(this.productsButton);
    }

    /**
     * Verify user is on home page
     */
    async verifyOnHomePage(): Promise<void> {
        await this.verifyTitle(/Automation Exercise/);
    }
}