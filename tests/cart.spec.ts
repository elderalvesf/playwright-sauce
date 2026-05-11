import { test, expect } from '../src/fixtures';
import { USERS, PRODUCTS } from '../src/data/testData';

test.describe('Cart', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('should show product added from inventory in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    const names = await cartPage.getItemNames();
    expect(names).toContain(PRODUCTS.backpack);
  });

  test('should show correct quantity in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    const quantities = await cartPage.getItemQuantities();
    expect(quantities[0]).toBe(1);
  });

  test('should remove product from cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.removeItemByName(PRODUCTS.backpack);
    const count = await cartPage.getItemCount();
    expect(count).toBe(0);
  });

  test('should navigate back to inventory when continuing shopping', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    await expect(cartPage.page).toHaveURL(/inventory/);
  });
});
