import { createSystem, defaultConfig } from '@chakra-ui/react';

// After updating theme, run this command to update autocomplete typings
// npx @chakra-ui/cli typegen ./src/theme.ts

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        black: { value: '#333333' },
        darkBlack: { value: '#1A202C' },
        white: { value: '#fff' },
        primary: { value: '#0099DB' },
        secondary: { value: '#034A85' },
        mode: {
          light: {
            primary: { value: '#659bc7' },
            secondary: { value: '#034A85' },
          },
          dark: {
            primary: { value: '#659bc7' },
            secondary: { value: '#0099DB' },
          },
        },
      },
    },
  },
});

export default system;
