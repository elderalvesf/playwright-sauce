import { test, expect } from '../src/fixtures';
import { USERS, PRODUCTS, CHECKOUT_INFO } from '../src/data/testData';

test.describe('Checkout', () => {

  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
  });

  test('should complete full checkout E2E flow', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.continue();
    await expect(checkoutPage.page).toHaveURL(/checkout-step-two/);
    await checkoutPage.finish();
    await expect(checkoutPage.page).toHaveURL(/checkout-complete/);
    const header = await checkoutPage.getConfirmationHeader();
    expect(header).toContain('Thank you for your order');
  });

  test('should show error when first name is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo({ ...CHECKOUT_INFO, firstName: '' });
    await checkoutPage.continue();
    expect(await checkoutPage.isErrorVisible()).toBe(true);
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('First Name is required');
  });

  test('should show error when last name is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo({ ...CHECKOUT_INFO, lastName: '' });
    await checkoutPage.continue();
    expect(await checkoutPage.isErrorVisible()).toBe(true);
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Last Name is required');
  });

  test('should show error when zip code is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo({ ...CHECKOUT_INFO, zipCode: '' });
    await checkoutPage.continue();
    expect(await checkoutPage.isErrorVisible()).toBe(true);
    const error = await checkoutPage.getErrorMessage();
    expect(error).toContain('Postal Code is required');
  });

  test('should display order summary with subtotal, tax and total', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo(CHECKOUT_INFO);
    await checkoutPage.continue();
    const subtotal = await checkoutPage.getSubtotal();
    const tax      = await checkoutPage.getTax();
    const total    = await checkoutPage.getTotal();
    expect(subtotal).toMatch(/Item total: \$/);
    expect(tax).toMatch(/Tax: \$/);
    expect(total).toMatch(/Total: \$/);
  });
});
