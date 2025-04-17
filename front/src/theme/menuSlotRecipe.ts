import { defineSlotRecipe } from '@chakra-ui/react';
import { menuAnatomy } from '@chakra-ui/react/anatomy';

export const menuSlotRecipe = defineSlotRecipe({
  slots: menuAnatomy.keys(),
  variants: {
    colorPalette: {
      customCyan: {
        content: {
          bg: 'cyan.800',
        },
        item: {
          _hover: {
            bg: 'cyan.700',
          },
        },
      },
    },
  },
});
