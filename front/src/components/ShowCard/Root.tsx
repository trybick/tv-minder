import { Flex, type FlexProps } from '@chakra-ui/react';
import { type PropsWithChildren, useMemo } from 'react';

import { useCarouselContext } from '~/components/carouselContext';

import { ShowCardProvider } from './context';
import { type ShowItem } from './helpers';

type Props = PropsWithChildren<
  FlexProps & {
    show: ShowItem;
    onHoverChange?: (isHovered: boolean) => void;
    hoverTransform?: FlexProps['transform'] | false;
  }
>;

/**
 * ShowCard is used for inside the Carousel component but also in search
 * results and Following list.
 */
export const Root = ({
  show,
  children,
  onHoverChange,
  hoverTransform,
  ...props
}: Props) => {
  const { size } = useCarouselContext();
  const isSmall = size === 'sm';

  const borderRadius = isSmall ? 'md' : 'xl';
  const resolvedHoverTransform =
    hoverTransform === false
      ? undefined
      : (hoverTransform ?? (isSmall ? undefined : 'translateY(-2px)'));

  const hoverStyles = {
    borderColor: 'cyan.500/40',
    shadow: '0 8px 25px -5px rgba(0, 0, 0, 0.3)',
    ...(resolvedHoverTransform ? { transform: resolvedHoverTransform } : {}),
  };

  const contextValue = useMemo(() => ({ show }), [show]);

  return (
    <ShowCardProvider value={contextValue}>
      <Flex
        direction="column"
        aria-label={`show-card-${show.name}`}
        h="100%"
        borderRadius={borderRadius}
        border="1px solid"
        borderColor="whiteAlpha.100"
        overflow="hidden"
        transition="all 0.2s ease-out"
        _hover={hoverStyles}
        position="relative"
        bg="whiteAlpha.50"
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        data-group
        {...props}
      >
        {children}
      </Flex>
    </ShowCardProvider>
  );
};
