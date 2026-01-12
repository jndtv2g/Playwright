import { Page } from "@playwright/test";
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

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to products page
     * Automatically dismisses popups after navigation
     */
    async navigateToProductsPage(): Promise<void> {
        await this.goto(`${this.baseURL}products`);
        // Popups are automatically dismissed by goto(), but we wait a bit for any delayed popups
        await this.page.waitForTimeout(1000);
        await this.dismissAllPopups();
    }

    /**
     * Verify user is on products page
     */
    async verifyOnProductsPage(): Promise<void> {
        await this.verifyURL(/products/);
    }
    
    /**
     * Click on a product from the listing page
     */
    async clickOnProduct(): Promise<void> {
        await this.click(this.PDPButton);
    }

    /**
     * Search for a product
     */
    async searchProduct(searchTerm: string): Promise<void> {
        await this.fill(this.searchInput, searchTerm);
        await this.click(this.searchButton);
    }

    /**
     * Get count of products displayed
     */
    async getProductCount(): Promise<number> {
        const products = await this.page.locator(this.productCard).count();
        return products;
    }

    /**
     * Click on a specific product by index
     */
    async clickProductByIndex(index: number): Promise<void> {
        await this.page.locator(this.productCard).nth(index).click();
    }
}

