import { test, expect } from "../fixtures/test.fixtures";
import { TEST_CREDENTIALS } from "../utils/constants";

test.describe.serial('Navigate to Showpo\'s PLP', () => {
    // *************** Test Cases: START *************** //
    
    test("Sweep through all categories", async ({ homePage, productListingPage }) => {
        // Navigate to the homepage
        // Popups are automatically dismissed by navigateToHomePage()
        await homePage.navigateToHomePage();

        // Navigate to the New In category
        await productListingPage.navigateToNewInCategory();

        // Navigate to the Clothes category
        await productListingPage.navigateToClothesCategory();

        // Navigate to the Dresses category
        await productListingPage.navigateToDressesCategory();

        // Navigate to the Tops category
        await productListingPage.navigateToTopsCategory();

        // Navigate to the Bottoms category
        await productListingPage.navigateToBottomsCategory();

        // Navigate to the Shoes & Accessories category
        await productListingPage.navigateToShoesAndAccessoriesCategory();

        // Navigate to the Wedding category
        await productListingPage.navigateToWeddingCategory();

        // Navigate to the Sale category
        await productListingPage.navigateToSaleCategory();

        // Verify we're on the product listing page
        // Popups are automatically dismissed continuously in the background
        await productListingPage.verifyOnProductListingPage();
    });

    // *************** Test Cases: END *************** //
});
