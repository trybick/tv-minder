import { defineSlotRecipe } from '@chakra-ui/react';
import { menuAnatomy } from '@chakra-ui/react/anatomy';

export const menuSlotRecipe = defineSlotRecipe({
  slots: menuAnatomy.keys(),
  variants: {
    colorPalette: {
      customCyan: {
        content: {
          bg: {
            base: 'white',
            _dark: 'cyan.900',
          },
        },
        item: {
          base: { _hover: { bg: 'gray.200' } },
          _dark: { _hover: { bg: 'cyan.800' } },
        },
      },
    },
  },
});
