import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('has the expected page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/New Wings Solutions/);
  });

  test('renders the navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header').first()).toBeVisible();
  });

  test('hero section mentions "Cinema"', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Cinema', { exact: false }).first()).toBeVisible();
  });

  test('shows the "Get a Quote" call to action', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('link', { name: /Get a Quote/i }).first(),
    ).toBeVisible();
  });
});
