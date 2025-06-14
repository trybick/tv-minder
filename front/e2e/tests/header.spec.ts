import { baseUrl } from '../../playwright.config';
import { expect, test } from '../config/base';

test.describe('Header', () => {
  test('should toggle color mode when clicking the color mode button', async ({
    page,
  }) => {
    await page.goto(baseUrl);

    const colorModeButton = page.getByRole('button', { name: /color mode/i });
    await expect(colorModeButton).toBeVisible();

    const initialBackgroundColor = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor
    );

    await colorModeButton.click();

    await page.waitForFunction(initialColor => {
      const currentColor = window.getComputedStyle(
        document.body
      ).backgroundColor;
      return currentColor !== initialColor;
    }, initialBackgroundColor);
  });

  test('should navigate to home page when clicking the logo', async ({
    page,
  }) => {
    await page.goto(`${baseUrl}/calendar`);

    await page.getByRole('button', { name: /tv minder logo/i }).click();

    await expect(page).toHaveURL(baseUrl);
  });
});
