import { Box, Text } from '@chakra-ui/react';
import { useMemo } from 'react';

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
  totalResults: number;
};

export const FilteredResults = ({ shows, totalResults }: Props) => {
  const showDetails = useAppSelector(selectShowDetails);
  const searchShowDetails = useAppSelector(selectSearchShowDetails);

  const showItems = useMemo(
    () => shows.filter(s => s.poster_path).map(mapTmdbShowSummary),
    [shows]
  );

  const badgeByShowId = useMemo(() => {
    const map = new Map<number, StatusBadge | null>();
    for (const show of showItems) {
      const cachedShow = showDetails?.[show.id] ?? searchShowDetails?.[show.id];
      if (!cachedShow) {
        map.set(show.id, null);
      } else {
        const { status } = mapShowInfoForDisplay(cachedShow);
        map.set(show.id, getStatusBadge(status));
      }
    }
    return map;
  }, [showItems, showDetails, searchShowDetails]);

  if (!showItems.length) {
    return (
      <Box textAlign="center" py="16">
        <Text color="fg.muted" fontSize="lg">
          No shows match your filters
        </Text>
        <Text color="fg.subtle" fontSize="sm" mt="1">
          Try adjusting your criteria
        </Text>
      </Box>
    );
  }

  const totalMatchesText = `${totalResults} ${maybePluralize(totalResults, 'result')}`;

  return (
    <Box w="100%" maxW="1200px" px={{ base: '3', md: '6' }}>
      <Text fontSize="md" color="fg.muted" textAlign="right" mb="4">
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
