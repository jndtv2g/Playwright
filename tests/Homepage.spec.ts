import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Validate Showpo website', () => {
    // *************** Test Cases: START *************** //

    test("Navigate to Showpo homepage", async ({ homePage }) => {
        // Navigate to the homepage
        await homePage.navigateToHomePage();
        
        // Verify the title of the page
        await homePage.verifyOnHomePage();
    });

    // *************** Test Cases: END *************** //
}); 