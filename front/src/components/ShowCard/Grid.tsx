import { Grid as ChakraGrid, type GridProps } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

export const showElementsByBreakpoint = {
  base: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
} as const;

export const showCardTemplateColumns = Object.fromEntries(
  Object.entries(showElementsByBreakpoint).map(([key, value]) => [
    key,
    `repeat(${value}, 1fr)`,
  ])
);

type Props = PropsWithChildren<GridProps>;

export const Grid = ({ children, ...props }: Props) => (
  <ChakraGrid
    templateColumns={showCardTemplateColumns}
    gap={{ base: '3', md: '5' }}
    {...props}
  >
    {children}
  </ChakraGrid>
);
