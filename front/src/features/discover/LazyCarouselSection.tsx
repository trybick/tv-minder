import { Box, Separator } from '@chakra-ui/react';

import { Carousel } from '~/components/Carousel';
import { type ShowItem } from '~/components/ShowCard';
import { useIsNearViewport } from '~/hooks/useIsNearViewport';

import { DiscoverHeader } from './DiscoverHeader';
import { DiscoverShowCard } from './DiscoverShowCard';
import { type CarouselConfig } from './DiscoverShows';

const keyExtractor = (show: ShowItem) => show.id;
const renderItem = (show: ShowItem) => <DiscoverShowCard show={show} />;

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
      <Carousel
        items={isNear ? items : []}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </Box>
  );
};
