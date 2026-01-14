import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Navigate to Showpo\'s list of products', () => {
    // *************** Test Cases: START *************** //
    
    test("Navigate to PLP", async ({ homePage, productListingPage }) => {
        // Navigate to the homepage
        // Popups are automatically dismissed by navigateToHomePage()
        await homePage.navigateToHomePage();

        // Navigate to the Products page
        // Popups are automatically dismissed by goToProductsPage()
        await productListingPage.navigateToNewInCategory();
        
        // Run validations while continuously checking for and dismissing popups
        await productListingPage.runValidationsWithPopupDismissal([
            async () => await productListingPage.verifyOnProductListingPage()
        ]); 
    });

    // *************** Test Cases: END *************** //
});
