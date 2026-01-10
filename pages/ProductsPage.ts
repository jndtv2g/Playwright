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

    constructor(page: Page) {
        super(page);
    }

    /**
     * Navigate to products page
     */
    async navigateToProductsPage(): Promise<void> {
        await this.goto(`${this.baseURL}products`);
    }

    /**
     * Verify user is on products page
     */
    async verifyOnProductsPage(): Promise<void> {
        await this.verifyURL(/products/);
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

