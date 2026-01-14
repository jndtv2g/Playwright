import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Products Page Object Model
 */
export class ProductsPage extends BasePage {
    private productsContainer: string = '.features_items';
    private productCard: string = '.product-image-wrapper';
    private searchInput: string = '#search_product';
    private searchButton: string = '#submit_search';
    private PDPButton: string = 'a[href="/product_details/2]';
    private productCount: string = '.whitespace-nowrap.text-xs.font-normal.text-neutral-1000.sm\:text-sm'

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to products page
     * Automatically dismisses popups after navigation
     */
    async navigateToNewInPage(): Promise<void> {
        await this.goto(`${this.baseURL}products`);
        // Popups are automatically dismissed by goto(), but we wait a bit for any delayed popups
        await this.page.waitForTimeout(1000);
        await this.dismissAllPopups();
    }

    async navigateToCategory(categoryName: string, expectedHeaderText: string): Promise<void> {
        await this.page.getByText(categoryName).click({force: true});
        await this.dismissAllPopups();
        await this.verifyTitle(expectedHeaderText);
        const productCount = await this.page.locator(this.productCount).textContent();
        expect(productCount).toBeGreaterThan(0);
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
     * Navigate to Sale category
     */
    async navigateToSaleCategory(): Promise<void> {
        await this.navigateToCategory('Sale', 'Sale');
    }
}

