import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CheckoutInfo } from '../data/testData';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput  = '[data-test="firstName"]';
  private readonly lastNameInput   = '[data-test="lastName"]';
  private readonly zipCodeInput    = '[data-test="postalCode"]';
  private readonly continueBtn     = '[data-test="continue"]';
  private readonly finishBtn       = '[data-test="finish"]';
  private readonly errorMessage    = '[data-test="error"]';
  private readonly summarySubtotal = '.summary_subtotal_label';
  private readonly summaryTax      = '.summary_tax_label';
  private readonly summaryTotal    = '.summary_total_label';
  private readonly confirmHeader   = '.complete-header';

  constructor(page: Page) {
    super(page);
  }

  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.fill(this.firstNameInput, info.firstName);
    await this.fill(this.lastNameInput, info.lastName);
    await this.fill(this.zipCodeInput, info.zipCode);
  }

  async continue(): Promise<void> {
    await this.click(this.continueBtn);
  }

  async finish(): Promise<void> {
    await this.click(this.finishBtn);
    await this.waitForUrl(/checkout-complete/);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  async getSubtotal(): Promise<string> {
    return this.getText(this.summarySubtotal);
  }

  async getTax(): Promise<string> {
    return this.getText(this.summaryTax);
  }

  async getTotal(): Promise<string> {
    return this.getText(this.summaryTotal);
  }

  async getConfirmationHeader(): Promise<string> {
    return this.getText(this.confirmHeader);
  }
}
