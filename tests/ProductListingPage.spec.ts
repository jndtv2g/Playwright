import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Navigate to list of products', () => {
    // *************** Test Cases: START *************** //
    
    test("Navigate to PLP", async ({ homePage, productsPage }) => {
        // Navigate to the homepage
        await homePage.navigateToHomePage();

        // Navigate to the Products page
        await homePage.goToProductsPage();
        
        // Verify user is on products page  
        await productsPage.verifyOnProductsPage();
    });

    // *************** Test Cases: END *************** //
});