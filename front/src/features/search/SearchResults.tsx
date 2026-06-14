import { Box, Text } from '@chakra-ui/react';

import {
  getStatusBadge,
  mapTmdbShowSummary,
  ShowCard,
  type StatusBadge,
} from '~/components/ShowCard';
import { useAppSelector } from '~/store';
import {
  selectSearchShowDetails,
  selectShowDetails,
} from '~/store/tv/selectors';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { mapShowInfoForDisplay } from '~/store/tv/utils/formatting';
import { maybePluralize } from '~/utils/formatting';

import { SearchResultCard } from './SearchResultCard';

type Props = {
  shows: TmdbShowSummary[];
};

export const SearchResults = ({ shows }: Props) => {
  const totalMatchesText = `Showing ${shows.length} ${maybePluralize(shows.length, 'result')}`;
  const showDetails = useAppSelector(selectShowDetails);
  const searchShowDetails = useAppSelector(selectSearchShowDetails);

  const showItems = shows.map(mapTmdbShowSummary);

  const badgeByShowId = new Map<number, StatusBadge | null>();
  for (const show of showItems) {
    const cachedShow = showDetails?.[show.id] ?? searchShowDetails?.[show.id];
    if (!cachedShow) {
      badgeByShowId.set(show.id, null);
    } else {
      const { status } = mapShowInfoForDisplay(cachedShow);
      badgeByShowId.set(show.id, getStatusBadge(status));
    }
  }

  return (
    <Box w="100%">
      <Text fontSize="md" color="fg.muted" textAlign="left" mb="4">
        {totalMatchesText}
      </Text>

      <ShowCard.Grid>
        {showItems.map(show => (
          <SearchResultCard
            key={show.id}
            show={show}
            badge={badgeByShowId.get(show.id) ?? null}
          />
        ))}
      </ShowCard.Grid>
    </Box>
  );
};
