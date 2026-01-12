import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Navigate to detail of selected product', () => {
    // *************** Test Cases: START *************** //
    
    test("Navigate to PDP", async ({ homePage, productsPage }) => {
        // Navigate to the homepage
        await homePage.navigateToHomePage();

        // Navigate to the Products page
        await homePage.goToProductsPage();
        
        // Run validations and actions while continuously checking for and dismissing popups
        await productsPage.runValidationsWithPopupDismissal([
            async () => await productsPage.verifyOnProductsPage(),
            async () => await productsPage.clickOnProduct()
        ]);
    });

    // *************** Test Cases: END *************** //
});