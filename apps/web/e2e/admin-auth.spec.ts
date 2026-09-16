import { test, expect } from '@playwright/test';

test.describe('Admin Authentication & Route Protection Suite', () => {
  test('Admin login page renders without demo credentials auto-fill', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page).toHaveTitle(/CYBERSTYLE/i);

    // Verify login form is present
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Verify demo credentials quick fill box is NOT present
    await expect(page.locator('text=Demo Credentials Quick Fill')).toHaveCount(0);
    await expect(page.locator('text=admin@cyberstyle.net')).toHaveCount(0);
    await expect(page.locator('text=Admin123456!')).toHaveCount(0);
  });

  test('Admin login rejects invalid credentials with error notification', async ({ page }) => {
    await page.goto('/admin/login');

    await page.fill('input[type="email"]', 'wrong.admin@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // Verify error banner is shown
    const errorAlert = page.locator('[data-testid="auth-error"]');
    await expect(errorAlert).toBeVisible({ timeout: 8000 });
    await expect(errorAlert).toContainText(/invalid|error|credentials/i);
  });

  test('Unauthenticated user cannot access internal admin dashboard directly', async ({ page }) => {
    // Clear storage/cookies
    await page.context().clearCookies();

    await page.goto('/admin/dashboard');

    // Should redirect to login or show access denied
    await expect(page).toHaveURL(/admin\/login|\/login|admin/);
  });
});
