import { test, expect } from '../src/fixtures';
import { USERS }        from '../src/data/testData';

test.describe('Login', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(loginPage.page).toHaveURL(/inventory/);
  });

  test('should show error with invalid password', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Epic sadface');
  });

  test('should show specific error for locked out user', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Sorry, this user has been locked out');
  });

  test('should show validation when fields are empty', async ({ loginPage }) => {
    await loginPage.login('', '');
    expect(await loginPage.isErrorVisible()).toBe(true);
  });

  test('should logout and redirect to login page', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(loginPage.page).toHaveURL(/inventory/);
    await loginPage.logout();
    await expect(loginPage.page).toHaveURL('/');
  });
});
