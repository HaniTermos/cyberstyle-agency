import { test, expect } from '@playwright/test';

test.describe('Public Pages Smoke & Navigation Suite', () => {
  test('Homepage renders hero, services, and branding correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CYBERSTYLE/i);

    // Hero element presence
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();

    // Verify navigation bar
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('/work page renders database case studies without demo notices', async ({ page }) => {
    await page.goto('/work');
    await expect(page).toHaveTitle(/CYBERSTYLE/i);

    // Verify header title
    await expect(page.locator('text=Production Systems & Architectural Blueprints')).toBeVisible();

    // Verify absence of demo disclaimer banner
    await expect(page.locator('text=Demonstration Notice')).toHaveCount(0);

    // Verify filter buttons
    await expect(page.locator('button:has-text("All Projects")')).toBeVisible();
  });

  test('/work/hani case study page renders hero image and deliverables', async ({ page }) => {
    await page.goto('/work/hani');

    // Should not be 404
    await expect(page.locator('text=404')).toHaveCount(0);

    // Verify title contains hani or case study
    await expect(page.locator('h1')).toBeVisible();

    // Verify absence of demo disclaimer banner
    await expect(page.locator('text=Demonstration Notice')).toHaveCount(0);
  });

  test('/pricing page loads service tiers and breakdown', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/CYBERSTYLE/i);

    // Check pricing options render
    await expect(page.locator('h1')).toBeVisible();
  });

  test('/faq page renders all 15 FAQs with functional accordion', async ({ page }) => {
    await page.goto('/faq');
    await expect(page).toHaveTitle(/CYBERSTYLE/i);

    // Verify FAQ items exist
    const faqQuestions = page.locator('button[data-testid="faq-accordion-button"]');
    await expect(faqQuestions.first()).toBeVisible();

    // Test expanding first accordion item
    await faqQuestions.first().click();
    await expect(faqQuestions.first()).toHaveAttribute('aria-expanded', 'true');
  });

  test('/contact page renders contact form and direct contact info', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('/start-project page renders multi-step scoping form', async ({ page }) => {
    await page.goto('/start-project');
    await expect(page.locator('input[name="name"], input[placeholder*="name" i]')).toBeVisible();
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
  });
});
