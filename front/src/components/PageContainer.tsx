import { Box, type BoxProps } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

type Props = PropsWithChildren<BoxProps>;

export const PageContainer = ({ children, ...props }: Props) => {
  return (
    <Box w="100%" maxW="1280px" mx="auto" px={{ base: 4, md: 6 }} {...props}>
      {children}
    </Box>
  );
};
