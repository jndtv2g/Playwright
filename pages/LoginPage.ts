import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Login Page Object Model
 */
export class LoginPage extends BasePage {
    private emailField: string = '[data-qa="login-email"]';
    private passwordField: string = '[data-qa="login-password"]';
    private loginButton: string = '[data-qa="login-button"]';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Login with email and password
     */
    async login(email: string, password: string): Promise<void> {
        await this.fill(this.emailField, email);
        await this.fill(this.passwordField, password);
        await this.click(this.loginButton);
    }

    /**
     * Verify that the user is on the login page
     */
    async verifyOnLoginPage(): Promise<void> {
        await this.waitForURL(/login/);
    }

    /**
     * Fill email field
     */
    async enterEmail(email: string): Promise<void> {
        await this.fill(this.emailField, email);
    }

    /**
     * Fill password field
     */
    async enterPassword(password: string): Promise<void> {
        await this.fill(this.passwordField, password);
    }

    /**
     * Click login button
     */
    async clickLoginButton(): Promise<void> {
        await this.click(this.loginButton);
    }

    async verifyLoginSuccess(): Promise<void> {
        await expect(this.page.getByText('Logged in as')).toBeVisible();
    }
}
