import { type ButtonProps, Flex, type FlexProps } from '@chakra-ui/react';
import { type PropsWithChildren, useMemo } from 'react';

import { useCarouselContext } from '~/components/carouselContext';

import { ShowCardProvider } from './context';
import { type ShowItem } from './helpers';

type Props = PropsWithChildren<
  FlexProps & {
    show: ShowItem;
    onHoverChange?: (isHovered: boolean) => void;
    trackButtonSize?: ButtonProps['size'];
  }
>;

/**
 * ShowCard is used for inside the Carousel component but also in search
 * results and Tracking list.
 */
export const Root = ({
  show,
  children,
  onHoverChange,
  trackButtonSize = 'md',
  ...props
}: Props) => {
  const { size } = useCarouselContext();
  const isSmall = size === 'sm';
  const borderRadius = isSmall ? 'md' : 'xl';

  const contextValue = useMemo(
    () => ({ show, trackButtonSize }),
    [show, trackButtonSize]
  );

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
        position="relative"
        bg="whiteAlpha.50"
        _hover={{
          borderColor: 'whiteAlpha.300',
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        }}
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
