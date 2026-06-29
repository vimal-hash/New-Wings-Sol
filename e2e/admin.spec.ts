import { test, expect } from '@playwright/test';

test.describe('Admin panel', () => {
  test('shows the admin heading and quote table headers', async ({ page }) => {
    await page.goto('/admin');

    await expect(
      page.getByRole('heading', { name: /NW Solutions/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('columnheader', { name: 'Name' }),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Company' }),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Status' }),
    ).toBeVisible();
  });
});
