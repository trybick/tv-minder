import { Grid as ChakraGrid, type GridProps } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

export const showCardColumnsByBreakpoint = {
  base: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
} as const;

const showCardTemplateColumns = Object.fromEntries(
  Object.entries(showCardColumnsByBreakpoint).map(([key, value]) => [
    key,
    `repeat(${value}, 1fr)`,
  ])
);

type Props = PropsWithChildren<GridProps>;

export const Grid = ({ children, ...props }: Props) => (
  <ChakraGrid
    templateColumns={showCardTemplateColumns}
    gap={{ base: '3', md: '4' }}
    {...props}
  >
    {children}
  </ChakraGrid>
);
