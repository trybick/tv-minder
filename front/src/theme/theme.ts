import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import { globalCss } from './globalCss';
import { menuSlotRecipe } from './menuSlotRecipe';

const customConfig = defineConfig({
  globalCss: {
    ...globalCss,
    html: {
      colorPalette: 'cyan',
    },
    body: {
      backgroundColor: 'bg.muted',
    },
  },

  theme: {
    tokens: {
      fonts: {
        heading: { value: '"DM Sans", sans-serif' },
        body: { value: '"DM Sans", sans-serif' },
      },
    },
    slotRecipes: {
      menu: menuSlotRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);

//
// When you configure the system properties (like colors, space, fonts, etc.),
// the CLI can be used to generate type definitions for them. This will update
// the internal types in the @chakra-ui/react package, and make sure they are in
// sync with the theme.
// npx @chakra-ui/cli typegen ./src/theme.ts
//
