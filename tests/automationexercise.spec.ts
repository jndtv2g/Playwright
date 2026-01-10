import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Validate Automation Exercise website', () => {
    // *************** Test Cases: START *************** //

    test("Navigate to Automation Exercise homepage", async ({ homePage }) => {
        // Navigate to the homepage
        await homePage.navigateToHomePage();
        
        // Verify the title of the page
        await homePage.verifyOnHomePage();
    });

    test("Login to site as existing user", async ({ homePage, loginPage }) => {
        // Navigate to the login page
        await homePage.goToLoginPage();

        // Verify if user landed on login page
        await loginPage.verifyOnLoginPage();

        // Enter login credentials and login
        await loginPage.login(TEST_CREDENTIALS.validEmail, TEST_CREDENTIALS.validPassword);
    });
    
    test("Navigate to list of products", async ({ homePage, productsPage }) => {
        // Navigate to the Products page
        await homePage.goToProductsPage();
        
        // Verify user is on products page
        await productsPage.verifyOnProductsPage();
    });

    // *************** Test Cases: END *************** //
});