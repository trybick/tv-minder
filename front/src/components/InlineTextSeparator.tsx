import { chakra, Flex } from '@chakra-ui/react';

export const InlineTextSeparator = chakra(Flex, {
  base: {
    '&:before, &:after': {
      content: '""',
      flex: 1,
      borderBottom: '1px solid',
      borderColor: 'whiteAlpha.200',
    },
    '&:before': {
      marginRight: '4',
    },
    '&:after': {
      marginLeft: '4',
    },
  },
});
