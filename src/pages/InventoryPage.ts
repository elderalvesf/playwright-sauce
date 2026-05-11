import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly productList      = '.inventory_item';
  private readonly sortDropdown     = '[data-test="product-sort-container"]';
  private readonly cartBadge        = '.shopping_cart_badge';
  private readonly cartLink         = '.shopping_cart_link';

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/inventory.html');
  }

  async getProductCount(): Promise<number> {
    return this.page.locator(this.productList).count();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.page.locator(this.sortDropdown).selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.page.locator('.inventory_item_price').allInnerTexts();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async addToCartByName(productName: string): Promise<void> {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await item.locator('button').click();
  }

  async removeFromCartByName(productName: string): Promise<void> {
    const item = this.page.locator('.inventory_item').filter({ hasText: productName });
    await item.locator('button').click();
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator(this.cartBadge);
    const isVisible = await badge.isVisible();
    if (!isVisible) return 0;
    return parseInt(await badge.innerText(), 10);
  }

  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
    await this.waitForUrl(/cart/);
  }
}
