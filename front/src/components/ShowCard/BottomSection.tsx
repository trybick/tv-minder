import { Flex } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

export const BottomSection = ({ children }: PropsWithChildren) => (
  <Flex
    direction="column"
    p={{ base: '2.5', md: '3' }}
    gap="2.5"
    flex="1"
    justify="space-between"
  >
    {children}
  </Flex>
);
