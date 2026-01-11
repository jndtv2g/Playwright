import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Navigate to detail of selected product', () => {
    // *************** Test Cases: START *************** //
    
    test("Navigate to PDP", async ({ homePage, productsPage }) => {
        // Navigate to the homepage
        await homePage.navigateToHomePage();

        // Navigate to the Products page
        await homePage.goToProductsPage();
        
        // Verify user is on products page  
        await productsPage.verifyOnProductsPage();

        // Click on a product from the list
        await productsPage.clickOnProduct();
    });

    // *************** Test Cases: END *************** //
});