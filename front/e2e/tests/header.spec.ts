import { expect, test } from '../config/base';

test.describe('Header', () => {
  test('should navigate to home page when clicking the logo', async ({
    page,
  }) => {
    await page.goto('/calendar');

    await page.getByRole('button', { name: /tv minder logo/i }).click();

    await expect(page).toHaveURL('/');
  });
});
