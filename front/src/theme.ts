import { Colors, extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
};

const colors: Colors = {
  black: '#333333',
  darkBlack: '#1A202C',
  white: '#fff',
  primary: '#0099DB',
  secondary: '#034A85',
  mode: {
    light: {
      primary: '#659bc7',
      secondary: '#034A85',
    },
    dark: {
      primary: '#659bc7',
      secondary: '#0099DB',
    },
  },
};

const breakpoints = {
  xs: '30em',
  sm: '36em',
  md: '46.25em',
  lg: '62.5em',
  xl: '78.125em',
  xxl: '95em',
};

export default extendTheme({ config, colors, breakpoints });
