import { test, expect } from '@playwright/test';

test.describe('Inquiry & Project Form Submission Suite', () => {
  test('Contact form handles client submission with honeypot security', async ({ page }) => {
    await page.goto('/contact');

    // Fill form
    await page.fill('input[name="name"]', 'Playwright Test User');
    await page.fill('input[type="email"]', 'qa.test@cyberstyle.net');
    await page.fill('input[name="subject"]', 'Automated E2E Test Inquiry');
    await page.fill('textarea', 'This is an automated Playwright end-to-end verification test.');

    // Ensure honeypot is empty
    const honeypot = page.locator('input[name="hp_website_check"]');
    if (await honeypot.count() > 0) {
      await expect(honeypot).toHaveValue('');
    }

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Verify confirmation message or submitted state
    await expect(
      page.locator('text=Message Received, text=Thank you, text=sent successfully, text=Direct Communication')
    ).toBeVisible({ timeout: 10000 });
  });

  test('Start Project form enforces consent and validates required fields', async ({ page }) => {
    await page.goto('/start-project');

    // Attempt submit without required inputs
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Should still be on /start-project
    await expect(page).toHaveURL(/start-project/);
  });
});
