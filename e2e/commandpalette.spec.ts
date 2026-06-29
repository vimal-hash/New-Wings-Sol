import { test, expect } from '@playwright/test';

test.describe('Command palette', () => {
  test('opens with Ctrl+K, filters, and closes with Escape', async ({
    page,
  }) => {
    await page.goto('/');

    // The Ctrl+K listener is attached in a useEffect, so it only works once the
    // client has hydrated. The navbar animates into place (Framer Motion) right
    // after hydration, so waiting for its command-palette pill to actually be
    // in the viewport is a reliable "fully interactive" gate — stronger than
    // toBeVisible(), which is satisfied by the pre-hydration server HTML.
    const trigger = page.getByRole('button', { name: /command palette/i });
    await expect(trigger).toBeInViewport({ timeout: 20_000 });

    const input = page.getByPlaceholder('Search pages, products, actions...');

    // Open
    await page.keyboard.press('Control+KeyK');
    await expect(input).toBeVisible();

    // Filter
    await input.fill('products');
    await expect(
      page.getByRole('button', { name: /Browse Products/i }),
    ).toBeVisible();

    // Close
    await page.keyboard.press('Escape');
    await expect(input).toBeHidden();
  });
});
