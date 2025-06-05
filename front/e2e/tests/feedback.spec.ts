import { expect, test } from '@playwright/test';

import { baseUrl } from '../playwright.config';

test.describe('Feedback', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the feedback API
    await page.route('**/api/feedback', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Feedback submitted successfully',
        }),
      });
    });
  });

  test('should submit feedback successfully', async ({ page }) => {
    await page.goto(baseUrl);

    // Open feedback modal
    await page.getByRole('button', { name: /feedback/i }).click();

    const feedbackModal = page.getByRole('dialog', { name: 'Feedback' });
    await expect(feedbackModal).toBeVisible();

    // Fill in feedback form
    await page
      .getByRole('textbox', { name: /feedback/i })
      .fill('This is a test feedback message');
    await page.getByRole('combobox', { name: /type/i }).selectOption('bug');
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify success message
    await expect(
      page.getByText('Feedback submitted successfully')
    ).toBeVisible();

    // Verify modal is closed
    await expect(feedbackModal).not.toBeVisible();
  });
});
