import { Flex } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

export const Details = ({ children }: PropsWithChildren) => (
  <Flex direction="column" p="3" gap="2" flex="1" justify="space-between">
    {children}
  </Flex>
);
