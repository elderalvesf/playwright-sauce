import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems         = '.cart_item';
  private readonly continueShoppingBtn = '[data-test="continue-shopping"]';
  private readonly checkoutBtn       = '[data-test="checkout"]';

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/cart.html');
  }

  async getItemCount(): Promise<number> {
    return this.page.locator(this.cartItems).count();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async getItemQuantities(): Promise<number[]> {
    const texts = await this.page.locator('.cart_quantity').allInnerTexts();
    return texts.map(t => parseInt(t, 10));
  }

  async removeItemByName(productName: string): Promise<void> {
    const item = this.page.locator('.cart_item').filter({ hasText: productName });
    await item.locator('button').click();
  }

  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingBtn);
    await this.waitForUrl(/inventory/);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutBtn);
    await this.waitForUrl(/checkout-step-one/);
  }
}
