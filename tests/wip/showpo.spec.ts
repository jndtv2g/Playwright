import { chromium, test, expect } from "@playwright/test";

test.describe.serial('Validate Showpo website', () => {
    /** @type {import('@playwright/test').Page} */
    let browserInstance; 
    let context;
    let page;

    // This runs once before all tests in this block
    test.beforeAll(async () => {
        // Launch the browser (store it in browserInstance to avoid reusing the name)
        browserInstance = await chromium.launch({ headless: false });

        // Set a large viewport size (like full HD resolution)
        context = await browserInstance.newContext({
            viewport: { width: 1280, height: 680 },
        });

        // Create a single page instance to reuse
        page = await context.newPage();
    });

    // This runs once after all tests in this block
    test.afterAll(async () => {
        if (page) {
            await page.close(); // Close the page after all tests are done
        }
        if (browserInstance) {
            await browserInstance.close(); // Close the browser after all tests are done
        }
    });

    test("Navigate to Showpo homepage", async () => {
        // Navigate to the homepage
        await page.goto("https://www.showpo.com/uk/");
        
        // Verify the title of the page
        await expect(page).toHaveTitle(/Showpo/);
    });

    test("Login to Showpo as existing user", async () => {
        // Navigate to the login page
        await page.goto("https://www.showpo.com/uk/customer/account/login/");

        // Verify if user landed on login page
        await expect(page).toHaveURL(/account/); // Adjust this to match a post-login URL or specific element

        // Fill in login details
        await page.fill('input[name="email"]', 'dev@showpo.com'); // Replace with your email selector and value
        await page.fill('input[name="password"]', 'Showpo123!');       // Replace with your password selector and value

        // Click the login button
        await page.getByRole('button', { name: 'Log In' }).click() // Adjust selector if needed
        
    });
    
    test("Navigate to Showpo Dresses page", async () => {
        // Navigate to the Dresses page
        await page.goto("https://www.showpo.com/uk/dresses/");
        
        // Verify the title of the page includes 'Dresses'
        await expect(page).toHaveTitle(/Dresses/);
    });

    

});