import { type ShowItem } from '~/components/ShowCard';

import { DiscoverShowCard } from './DiscoverShowCard';

export const discoverShowKeyExtractor = (show: ShowItem) => show.id;

export const renderDiscoverShowItem = (show: ShowItem) => (
  <DiscoverShowCard show={show} />
);
