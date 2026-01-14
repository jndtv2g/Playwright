/**
 * Constants used across the test suite
 */
export const BASE_URL = "https://showpo.com/";

/**
 * Test user credentials
 */
export const TEST_CREDENTIALS = {
    validEmail: 'valid@abc.com',
    validPassword: 'password',
    invalidEmail: 'invalid@test.com',
    invalidPassword: 'wrongpassword'
};

/**
 * Page URLs
 */
export const PAGE_URLS = {
    home: BASE_URL,
    login: `${BASE_URL}login`,
    products: `${BASE_URL}products`
};

/**
 * Selectors - Common selectors that might be reused
 */
export const SELECTORS = {
    loginButton: 'a[href="/login"]',
    productsButton: 'text=Products'
};

