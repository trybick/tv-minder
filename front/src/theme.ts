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

export default extendTheme({ config, colors });
