import { theme as defaultTheme } from '@chakra-ui/react';

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
        primary: '#659bc7',
        secondary: '#034A85',
      },
      dark: {
        ...defaultTheme.colors,
        secondary: '#0099DB',
        primary: '#659bc7',
      },
    },
  },
};
