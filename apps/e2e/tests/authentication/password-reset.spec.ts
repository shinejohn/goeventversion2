import { expect, test } from '@playwright/test';

import { AuthPageObject } from './auth.po';

const email = 'custom@makerkit.dev';
const newPassword = (Math.random() * 10000).toString();

test.describe('Password Reset Flow', () => {
  test('will reset the password and sign in with new one', async ({ page }) => {
    const auth = new AuthPageObject(page);

    await expect(async () => {
      await page.goto('/auth/password-reset');

      await page.waitForTimeout(100);
      await page.locator('input[type="email"]').fill(email);

      await page.locator('form button').click({
        delay: 100,
      });

      await expect(page.locator('[role="alert"]')).toBeVisible();
    }).toPass();

    await auth.visitConfirmEmailLink(email);

    await page.waitForURL('/update-password');

    await auth.updatePassword(newPassword);

    await auth.signOut();

    await page
      .locator('a', {
        hasText: 'Sign in',
      })
      .click();

    await auth.signIn({
      email,
      password: newPassword,
    });

    await page.waitForURL('/home');
  });
});
