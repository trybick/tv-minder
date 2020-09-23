import { theme as defaultTheme } from '@chakra-ui/core';

export default {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    black: '#333333',
    // Overwriting a color like cyan at this level doesn't seem to work (TS error)
    // Access these colors by using 'c.cyan'
    c: {
      cyan: '#0099DB',
      navy: '#034A85',
    },
  },
};
