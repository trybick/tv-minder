import { Flex, type FlexProps } from '@chakra-ui/react';
import { type PropsWithChildren } from 'react';

import { type ShowItem } from './helpers';

type Props = PropsWithChildren<
  FlexProps & {
    show: ShowItem;
    onHoverChange?: (isHovered: boolean) => void;
  }
>;

export const Root = ({ show, children, onHoverChange, ...props }: Props) => (
  <Flex
    direction="column"
    aria-label={`show-card-${show.name}`}
    h="100%"
    borderRadius="xl"
    border="1px solid"
    borderColor="whiteAlpha.100"
    overflow="hidden"
    transition="all 0.2s ease-out"
    _hover={{
      borderColor: 'cyan.500/40',
      transform: 'translateY(-2px)',
      shadow: '0 8px 25px -5px rgba(0, 0, 0, 0.3)',
    }}
    position="relative"
    bg="whiteAlpha.50"
    onMouseEnter={() => onHoverChange?.(true)}
    onMouseLeave={() => onHoverChange?.(false)}
    data-group
    {...props}
  >
    {children}
  </Flex>
);
