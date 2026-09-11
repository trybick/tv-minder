import { Box, Skeleton } from '@chakra-ui/react';

import { Carousel } from '~/components/Carousel';
import { SectionHeader } from '~/components/SectionHeader';
import { type ShowItem } from '~/components/ShowCard';
import { useIsNearViewport } from '~/hooks/useIsNearViewport';

import { type CarouselConfig } from './DiscoverShows';
import {
  discoverShowKeyExtractor,
  renderDiscoverShowItem,
  SECTION_SPACING,
} from './discoverCarousel';

type Props = {
  config: CarouselConfig;
  items: ShowItem[];
  index: number;
};

export const LazyCarouselSection = ({ config, items, index }: Props) => {
  const { ref, isNear } = useIsNearViewport();

  return (
    <Box
      ref={ref}
      id={`discover-${config.key}`}
      mt={index > 0 ? SECTION_SPACING : 0}
    >
      <SectionHeader
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
