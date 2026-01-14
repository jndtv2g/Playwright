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

    /**
     * Normalize category name to URL format (e.g., "Shoes & Accessories" -> "shoes-accessories")
     */
    private normalizeCategoryNameForURL(categoryName: string): string {
        return categoryName
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    async navigateToCategory(categoryName: string, expectedHeaderText: string): Promise<void> {
        // Ensure page is still valid before proceeding
        if (this.page.isClosed()) {
            throw new Error('Page has been closed');
        }
        
        // Normalize category name for URL matching
        const normalizedCategory = this.normalizeCategoryNameForURL(categoryName);
        
        // Try multiple strategies to find the correct category link
        let categoryLink;
        try {
            // Strategy 1: Find link with href containing the normalized category and filter by text
            const linksWithHref = this.page.locator(`a[href*="/collections/${normalizedCategory}"]`);
            const count = await linksWithHref.count();
            
            if (count === 1) {
                categoryLink = linksWithHref.first();
            } else {
                // Filter by text content matching the category name
                const exactMatch = linksWithHref.filter({ hasText: new RegExp(`^${categoryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') });
                const exactMatchCount = await exactMatch.count();
                if (exactMatchCount > 0) {
                    categoryLink = exactMatch.first();
                } else {
                    // Try partial match
                    categoryLink = linksWithHref.filter({ hasText: categoryName }).first();
                }
            }
            await categoryLink.waitFor({ state: 'visible', timeout: 3000 });
        } catch (error) {
            try {
                // Strategy 2: Use getByRole with exact match and check href
                const allLinks = this.page.getByRole('link', { name: categoryName, exact: true });
                const linkCount = await allLinks.count();
                
                if (linkCount === 1) {
                    categoryLink = allLinks.first();
                } else {
                    // Find the one with the collections href
                    for (let i = 0; i < linkCount; i++) {
                        const link = allLinks.nth(i);
                        const href = await link.getAttribute('href');
                        if (href && href.includes(`/collections/${normalizedCategory}`)) {
                            categoryLink = link;
                            break;
                        }
                    }
                    // If still not found, use first one
                    if (!categoryLink) {
                        categoryLink = allLinks.first();
                    }
                }
                await categoryLink.waitFor({ state: 'visible', timeout: 3000 });
            } catch (error2) {
                // Strategy 3: Final fallback - just use first exact match
                categoryLink = this.page.getByRole('link', { name: categoryName, exact: true }).first();
                await categoryLink.waitFor({ state: 'visible', timeout: 3000 });
            }
        }
        
        await categoryLink.click({ force: true });
        await this.dismissAllPopups();
        
        // Wait for navigation to complete (reduced timeout)
        await this.page.waitForURL(/collections/, { timeout: 8000 });
        
        // Wait for DOM to be ready (reduced timeout)
        await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        
        // Small delay to allow any dynamic content to render
        await this.page.waitForTimeout(500);
        
        // Try to wait for network idle, but don't fail if it times out (reduced timeout)
        await this.page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => {
            // Network idle is optional - continue if it times out
        });
        
        // Ensure page is still valid before looking for elements
        if (this.page.isClosed()) {
            throw new Error('Page was closed during navigation');
        }
        
        // Use Playwright's getByRole which is more robust and flexible
        // Try multiple strategies to find the header with shorter timeouts
        let headerLocator;
        try {
            // First try: Use getByRole with heading level 1 and text
            headerLocator = this.page.getByRole('heading', { name: new RegExp(expectedHeaderText, 'i'), level: 1 });
            await headerLocator.waitFor({ state: 'visible', timeout: 5000 });
        } catch (error) {
            // Fallback 1: Try any heading with the text
            try {
                headerLocator = this.page.getByRole('heading', { name: new RegExp(expectedHeaderText, 'i') });
                await headerLocator.waitFor({ state: 'visible', timeout: 5000 });
            } catch (error2) {
                // Fallback 2: Try the CSS selector approach
                headerLocator = this.page.locator('h1').filter({ hasText: expectedHeaderText }).first();
                await headerLocator.waitFor({ state: 'visible', timeout: 5000 });
            }
        }
        
        // Verify the header text with a flexible check (reduced timeout)
        await expect(headerLocator).toHaveText(new RegExp(expectedHeaderText, 'i'), { timeout: 3000 });

        // Wait for product count element with fallback strategies (reduced timeouts)
        let productCountLocator;
        try {
            // First try: Use the specific selector
            productCountLocator = this.page.locator(this.productCount).first();
            await productCountLocator.waitFor({ state: 'visible', timeout: 5000 });
        } catch (error) {
            // Fallback: Try finding by partial class match
            try {
                productCountLocator = this.page.locator('[class*="text-sm"][class*="text-xs"]').first();
                await productCountLocator.waitFor({ state: 'visible', timeout: 5000 });
            } catch (error2) {
                // Final fallback: Just look for any element with product count pattern
                productCountLocator = this.page.locator('text=/\\d+.*product/i').first();
                await productCountLocator.waitFor({ state: 'visible', timeout: 5000 });
            }
        }
        
        // Verify product count should not be 0; otherwise page is in 5xx server error state
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

