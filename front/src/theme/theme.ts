import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

import { globalCss } from './globalCss';

const customConfig = defineConfig({
  globalCss: {
    ...globalCss,
    html: {
      colorPalette: 'cyan',
    },
    body: {
      backgroundColor: 'bg.muted',
      color: 'fg.muted',
    },
  },

  theme: {
    recipes: {
      heading: {
        base: {
          color: 'fg.muted',
        },
      },
      input: {
        base: {
          color: 'fg',
        },
      },
      textarea: {
        base: {
          color: 'fg',
        },
      },
    },
    tokens: {
      fonts: {
        heading: { value: '"DM Sans", sans-serif' },
        body: { value: '"DM Sans", sans-serif' },
      },
    },
    semanticTokens: {
      shadows: {
        xs: { value: '0 1px 2px {black/50}' },
        sm: { value: '0 1px 4px {black/55}' },
        md: { value: '0 2px 8px {black/60}' },
        lg: { value: '0 8px 16px {black/55}' },
        xl: { value: '0 16px 32px {black/55}' },
        '2xl': {
          value: '0 24px 48px -12px {black/50}, 0 0 0 1px {white/5}',
        },
      },
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
