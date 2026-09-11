import { type ShowItem } from '~/components/ShowCard';

import { DiscoverShowCard } from './DiscoverShowCard';

export const SECTION_SPACING = { base: 10, md: 14 };

export const discoverShowKeyExtractor = (show: ShowItem) => show.id;

export const renderDiscoverShowItem = (show: ShowItem) => (
  <DiscoverShowCard show={show} />
);
