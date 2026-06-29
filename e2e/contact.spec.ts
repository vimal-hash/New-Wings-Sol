import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test('submits a quote request and shows a success message', async ({
    page,
  }) => {
    await page.goto('/#contact');

    // Fields are wired with react-hook-form and identified by placeholder.
    await page.getByPlaceholder('John Doe').fill('Test User');
    await page.getByPlaceholder('john@cinema.com').fill('test@example.com');
    await page.getByPlaceholder('Royal Cinemas').fill('Test Cinema');
    await page
      .getByPlaceholder(/Tell us about your theatre/i)
      .fill('We need a full renovation with Dolby Atmos and recliner seating.');

    await page.getByRole('button', { name: /Send Message/i }).click();

    // The button swaps to the success copy once the submission resolves.
    await expect(page.getByText(/Message Sent/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
