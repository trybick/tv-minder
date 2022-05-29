import { Colors, extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'system',
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
      secondary: '#0099DB',
      primary: '#659bc7',
    },
  },
};

export default extendTheme({ config, colors });
