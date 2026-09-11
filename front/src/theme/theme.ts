import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import {
  alertAnatomy,
  dialogAnatomy,
  hoverCardAnatomy,
  menuAnatomy,
  popoverAnatomy,
} from '@chakra-ui/react/anatomy';

import { globalCss } from './globalCss';

const floatingSurface = {
  bg: 'bg.muted',
  borderWidth: '1px',
  borderColor: 'whiteAlpha.100',
  rounded: 'xl',
  shadow: '2xl',
} as const;

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
    '::selection': {
      backgroundColor: 'cyan.500/30',
    },
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--chakra-colors-white-alpha-300) transparent',
    },
  },

  theme: {
    slotRecipes: {
      dialog: {
        slots: dialogAnatomy.keys(),
        base: {
          backdrop: {
            zIndex: 'calc(var(--z-index) - 1)',
          },
          positioner: {
            zIndex: 'calc(var(--z-index) + 1)',
          },
          content: {
            ...floatingSurface,
            rounded: '2xl',
          },
          title: {
            color: 'fg',
            letterSpacing: 'tight',
          },
        },
      },
      menu: {
        slots: menuAnatomy.keys(),
        base: {
          content: floatingSurface,
        },
      },
      popover: {
        slots: popoverAnatomy.keys(),
        base: {
          content: floatingSurface,
        },
      },
      hoverCard: {
        slots: hoverCardAnatomy.keys(),
        base: {
          content: {
            rounded: 'xl',
            shadow: '2xl',
          },
        },
      },
      alert: {
        slots: alertAnatomy.keys(),
        base: {
          root: {
            rounded: 'lg',
          },
        },
      },
    },
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
