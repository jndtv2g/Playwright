import { chromium, test, expect, Page, Browser, BrowserContext } from "@playwright/test";

test.describe('Navigate to TikTok Live', () => {
    let browser: Browser;
    let context: BrowserContext; 
    let page: Page;

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: false });
        context = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        page = await context.newPage();
    });

    test.afterAll(async () => {
        await context.close();
        await browser.close();
    });
    
    test('Log in TikTok', async () => {
        await page.goto('https://www.tiktok.com/login');
        await page.locator('.ep888o80 tiktok-1mgli76-ALink-StyledLink epl6mg0').click();
        await page.locator('#username').fill('your_username');
        await page.locator('#password').fill('your_password');
        await page.locator('#login-button').click();
    });


    test('Navigate and click element', async () => {
        // Navigate to TikTok Live
        await page.goto('https://www.tiktok.com/@its_merlynn/live?enter_from_merge=others_homepage&enter_method=others_photo');

        // Click repeatedly with 500ms interval
        for (let i = 0; i < 5000000000; i++) { // Set to 100 iterations, adjust as needed
            await page.locator('.tiktok-1cu4ad.e1tv929b3').click();
            await page.waitForTimeout(500); // Wait 500ms between clicks
        }
        
        // Add verification that click was successful
        await expect(page.locator('.tiktok-1cu4ad.e1tv929b3')).toBeVisible();
    });
});

