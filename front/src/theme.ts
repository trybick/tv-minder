import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { globalCss } from './globalCss';

//
// When you configure the system properties (like colors, space, fonts, etc.),
// the CLI can be used to generate type definitions for them. This will update
// the internal types in the @chakra-ui/react package, and make sure they are in
// sync with the theme.
// npx @chakra-ui/cli typegen ./src/theme.ts
//

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
});

export const system = createSystem(defaultConfig, customConfig);

// List of chakra colors:
// https://www.chakra-ui.com/docs/theming/colors

// How to override chakra colors
// theme: {
//   semanticTokens: {
//     colors: {
//       'chakra-body-bg': {
//         value: { base: '#FFFFFF', _dark: '#1a202d' },
//       },
//     },
//   },
// },

// How to use custom colors:
// theme: {
// tokens: {
//   colors: {
//     primary: { value: '#fff' },
//     secondary: { value: '#fff' },
//   },
// },
// semanticTokens: {
//   colors: {
//     myColor: {
//       value: { base: '{colors.primary}', _dark: '{colors.secondary}' },
//     },
//   },
// },
// },
//  Then use like this:
// <Box bg="myColor">
