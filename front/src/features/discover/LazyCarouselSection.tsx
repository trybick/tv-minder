import { Box, Separator, Skeleton } from '@chakra-ui/react';

import { Carousel } from '~/components/Carousel';
import { type ShowItem } from '~/components/ShowCard';
import { useIsNearViewport } from '~/hooks/useIsNearViewport';

import { DiscoverHeader } from './DiscoverHeader';
import { type CarouselConfig } from './DiscoverShows';
import {
  discoverShowKeyExtractor,
  renderDiscoverShowItem,
} from './discoverCarousel';

type Props = {
  config: CarouselConfig;
  items: ShowItem[];
  index: number;
};

export const LazyCarouselSection = ({ config, items, index }: Props) => {
  const { ref, isNear } = useIsNearViewport();

  return (
    <Box ref={ref} id={`discover-${config.key}`}>
      {index > 0 && <Separator my={7} borderColor="whiteAlpha.200" />}
      <DiscoverHeader
        icon={config.icon}
        title={config.title}
        subtitle={config.subtitle}
      />
      {isNear ? (
        <Carousel
          items={items}
          keyExtractor={discoverShowKeyExtractor}
          renderItem={renderDiscoverShowItem}
        />
      ) : (
        <Skeleton borderRadius="xl" h={{ base: '260px', md: '320px' }} />
      )}
    </Box>
  );
};
