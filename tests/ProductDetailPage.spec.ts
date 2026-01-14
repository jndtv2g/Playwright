import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Navigate to detail of selected product', () => {
    // *************** Test Cases: START *************** //
    
    test("Navigate to PDP", async ({ homePage, productListingPage }) => {
        // Navigate to the homepage
        await homePage.navigateToHomePage();

        // Navigate to the Products page
        await productListingPage.navigateToNewInCategory();
        
        // Run validations and actions while continuously checking for and dismissing popups
        await productListingPage.runValidationsWithPopupDismissal([
            async () => await productListingPage.verifyOnProductListingPage(),
        ]);
    });

    // *************** Test Cases: END *************** //
});