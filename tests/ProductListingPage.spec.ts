import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Navigate to list of products', () => {
    // *************** Test Cases: START *************** //
    
    test("Navigate to PLP", async ({ homePage, productsPage }) => {
        // Navigate to the homepage
        // Popups are automatically dismissed by navigateToHomePage()
        await homePage.navigateToHomePage();

        // Navigate to the Products page
        // Popups are automatically dismissed by goToProductsPage()
        await homePage.goToProductsPage();
        
        // Run validations while continuously checking for and dismissing popups
        await productsPage.runValidationsWithPopupDismissal([
            async () => await productsPage.verifyOnProductsPage()
        ]);
    });

    // *************** Test Cases: END *************** //
});
