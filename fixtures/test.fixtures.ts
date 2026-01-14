import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { ProductsPage } from "../pages/ProductsPage";

/**
 * Custom fixtures that provide page objects to tests
 */
type PageObjects = {
    homePage: HomePage;
    loginPage: LoginPage;
    productListingPage: ProductsPage;
};

export const test = base.extend<PageObjects>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    productListingPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
});

export { expect } from "@playwright/test";

