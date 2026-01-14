import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Login to site as existing user', () => {
    // *************** Test Cases: START *************** //

    test("Login to site as existing user", async ({ homePage, loginPage }) => {
        // Navigate to the homepage
        // Popups are automatically dismissed by navigateToHomePage()
        await homePage.navigateToHomePage();
        
        // Navigate to the login page
        // Popups are automatically dismissed by goToLoginPage()
        await homePage.goToLoginPage();

        // Run validations while continuously checking for and dismissing popups
        await loginPage.runValidationsWithPopupDismissal([
            async () => await loginPage.verifyOnLoginPage(),
            async () => await loginPage.login(TEST_CREDENTIALS.validEmail, TEST_CREDENTIALS.validPassword),
            async () => await loginPage.verifyLoginSuccess()
        ]);
    });
    

    // *************** Test Cases: END *************** //
});
