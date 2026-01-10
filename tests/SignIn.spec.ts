import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Validate Automation Exercise website', () => {
    // *************** Test Cases: START *************** //

    test("Login to site as existing user", async ({ homePage, loginPage }) => {
        // Navigate to the homepage
        await homePage.navigateToHomePage();
        
        // Navigate to the login page
        await homePage.goToLoginPage();

        // Verify if user landed on login page
        await loginPage.verifyOnLoginPage();

        // Enter login credentials and login
        await loginPage.login(TEST_CREDENTIALS.validEmail, TEST_CREDENTIALS.validPassword);
    });
    

    // *************** Test Cases: END *************** //
});