import { theme as defaultTheme } from '@chakra-ui/core';

export default {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    black: '#333333',
    primary: '#0099DB',
    secondary: '#034A85',
    mode: {
      light: {
        ...defaultTheme.colors,
        primary: '#0099DB',
        secondary: '#034A85',
      },
      dark: {
        ...defaultTheme.colors,
        secondary: '#0099DB',
        primary: '#034A85',
      },
    },
  },
};
