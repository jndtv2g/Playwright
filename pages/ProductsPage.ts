import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Products Page Object Model
 */
export class ProductsPage extends BasePage {
    private productsContainer: string = '.features_items';
    // Use attribute selector to handle Tailwind responsive classes with colons
    private headerText: string = 'h1.uppercase.antialiased.text-sm.font-bold.text-neutral-1000[class*="text-2xl"]';
    private productCard: string = '.product-image-wrapper';
    private searchInput: string = '#search_product';
    private searchButton: string = '#submit_search';
    private PDPButton: string = 'a[href="/product_details/2]';
    // Use attribute selector to handle Tailwind responsive classes with colons
    private productCount: string = '.whitespace-nowrap.text-xs.font-normal.text-neutral-1000[class*="text-sm"]';

    constructor(page: Page) {
        super(page);
    }

    // /**
    //  * Navigate to products page
    //  * Automatically dismisses popups after navigation
    //  */
    // async navigateToNewInPage(): Promise<void> {
    //     await this.goto(`${this.baseURL}products`);
    //     // Popups are automatically dismissed by goto(), but we wait a bit for any delayed popups
    //     await this.page.waitForTimeout(1000);
    //     await this.dismissAllPopups();
    // }

    async navigateToCategory(categoryName: string, expectedHeaderText: string): Promise<void> {
        await this.page.getByText(categoryName).click({force: true});
        await this.dismissAllPopups();
        
        // Wait for navigation to complete
        await this.page.waitForURL(/collections/, { timeout: 10000 });
        
        // Wait for the page to be fully loaded - wait for network idle or load state
        await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {
            // If networkidle times out, at least wait for DOM to be ready
            return this.page.waitForLoadState('domcontentloaded');
        });
        
        // Wait for the header element to be visible and attached to DOM
        const headerLocator = this.page.locator(this.headerText);
        await headerLocator.waitFor({ state: 'visible', timeout: 10000 });
        
        // Now verify the header text
        await expect(headerLocator).toHaveText(expectedHeaderText, { timeout: 5000 });

        // Wait for product count element to be visible before checking
        const productCountLocator = this.page.locator(this.productCount);
        await productCountLocator.waitFor({ state: 'visible', timeout: 10000 });
        
        // Verify product count should not be 0
        const productCountText = await productCountLocator.textContent();
        const productCountNumber = parseInt(productCountText?.replace(/\D/g, '') || '0', 10);
        expect(productCountNumber).toBeGreaterThan(0);
        
        await this.dismissAllPopups();
    }

    /**
     * Verify user is on products page
     */
    async verifyOnProductListingPage(): Promise<void> {
        await this.verifyURL(/collections/);
    }

    /**
     * Navigate to New In category
     */
    async navigateToNewInCategory(): Promise<void> {
        await this.navigateToCategory('New In', 'New In');
    }
    
    /**
     * Navigate to Clothes category
     */
    async navigateToClothesCategory(): Promise<void> {
        await this.navigateToCategory('Clothes', 'Clothes');
    }

    /**
     * Navigate to Dresses category
     */
    async navigateToDressesCategory(): Promise<void> {
        await this.navigateToCategory('Dresses', 'Dresses');
    }

    /**
     * Navigate to Tops category
     */
    async navigateToTopsCategory(): Promise<void> {
        await this.navigateToCategory('Tops', 'Tops');
    }

    /**
     * Navigate to Bottoms category
     */
    async navigateToBottomsCategory(): Promise<void> {
        await this.navigateToCategory('Bottoms', 'Bottoms');
    }

    /**
     * Navigate to Shoes category
     */
    async navigateToShoesAndAccessoriesCategory(): Promise<void> {
        await this.navigateToCategory('Shoes & Accessories', 'Shoes & Accessories');
    }


    /**
     * Navigate to Wedding category
     */
    async navigateToWeddingCategory(): Promise<void> {
        await this.navigateToCategory('Wedding', 'Wedding');
    }


    /**
     * Navigate to Sale category
     */
    async navigateToSaleCategory(): Promise<void> {
        await this.navigateToCategory('Sale', 'Sale');
    }
}

