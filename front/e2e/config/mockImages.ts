import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { type Page } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const portraitSvg = fs.readFileSync(
  path.join(__dirname, '../mockAssets/e2e-placeholder-tv-portrait.svg')
);
const landscapeSvg = fs.readFileSync(
  path.join(__dirname, '../mockAssets/e2e-placeholder-tv-landscape.svg')
);

// Mock all images to avoid API calls
export const mockImages = async (page: Page) => {
  await page.route('**/*', route => {
    if (route.request().resourceType() !== 'image') {
      return route.fallback();
    }

    const url = route.request().url();
    const isLandscape = /\/t\/p\/(w300|w780|w1280)\//.test(url);

    route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: isLandscape ? landscapeSvg : portraitSvg,
    });
  });
};
