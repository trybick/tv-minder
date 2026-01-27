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
    borderRadius="lg"
    border="1px solid"
    borderColor="whiteAlpha.100"
    overflow="hidden"
    transition="all 0.2s"
    _hover={{ borderColor: 'whiteAlpha.400' }}
    position="relative"
    onMouseEnter={() => onHoverChange?.(true)}
    onMouseLeave={() => onHoverChange?.(false)}
    {...props}
  >
    {children}
  </Flex>
);
