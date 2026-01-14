import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Validate Showpo website', () => {
    // *************** Test Cases: START *************** //

    test("Navigate to Showpo homepage", async ({ homePage }) => {
        // Navigate to the homepage
        // Popups are automatically dismissed by navigateToHomePage()
        await homePage.navigateToHomePage();
        
        // Run validations while continuously checking for and dismissing popups
        // This ensures popups don't interfere with validation steps
        await homePage.runValidationsWithPopupDismissal([
            async () => await homePage.verifyOnHomePage()
        ]);
    });

    // *************** Test Cases: END *************** //
});
