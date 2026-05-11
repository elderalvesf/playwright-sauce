import { test, expect } from '../src/fixtures';
import { USERS, PRODUCTS } from '../src/data/testData';

test.describe('Inventory', () => {

  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.goto();
  });

  test('should display all 6 products', async ({ inventoryPage }) => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('should sort products by price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('should sort products by name A to Z', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getProductNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('should update cart badge when adding a product', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    const count = await inventoryPage.getCartBadgeCount();
    expect(count).toBe(1);
  });

  test('should remove badge when removing product from inventory page', async ({ inventoryPage }) => {
    await inventoryPage.addToCartByName(PRODUCTS.backpack);
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    await inventoryPage.removeFromCartByName(PRODUCTS.backpack);
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });
});
