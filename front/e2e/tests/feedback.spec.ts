import { expect, test } from '../config/base';
import { baseUrl } from '../config/playwright.config';

test.describe('Feedback', () => {
  test.beforeEach(async ({ page }) => {
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

    await page.getByRole('button', { name: /feedback/i }).click();

    const feedbackModal = page.getByRole('dialog', { name: 'Feedback' });
    await expect(feedbackModal).toBeVisible();

    await page
      .getByRole('textbox', { name: /feedback/i })
      .fill('This is a test feedback message');
    await page.getByRole('combobox', { name: /type/i }).selectOption('bug');
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(
      page.getByText('Feedback submitted successfully')
    ).toBeVisible();

    await expect(feedbackModal).not.toBeVisible();
  });
});
