import { chakra, Flex } from '@chakra-ui/react';

const InlineTextSeparator = chakra(Flex, {
  base: {
    '&:before, &:after': {
      content: '""',
      flex: 1,
      borderBottom: '1px solid grey',
    },
    '&:before': {
      marginRight: '15px',
    },
    '&:after': {
      marginLeft: '15px',
    },
  },
});

export default InlineTextSeparator;
