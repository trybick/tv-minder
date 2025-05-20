import { Box, Stack, Tag } from '@chakra-ui/react';

import { useAppDispatch, useAppSelector } from '~/store';
import {
  removeFromFollowedShowsAction,
  saveToFollowedShowsAction,
  setHasLocalWarningToastBeenShownAction,
} from '~/store/user/actions';
import {
  selectFollowedShows,
  selectHasLocalWarningToastBeenShown,
  selectIsLoggedIn,
} from '~/store/user/selectors';
import { ShowSearchResult } from '~/types/external';
import { maybePluralize } from '~/utils/formatting';

import SearchResult from './SearchResult';

type Props = {
  shows: ShowSearchResult[];
  totalResults: number;
};

const SearchResults = ({ shows, totalResults }: Props) => {
  const dispatch = useAppDispatch();
  const followedShows = useAppSelector(selectFollowedShows);
  const hasLocalWarningToastBeenShown = useAppSelector(
    selectHasLocalWarningToastBeenShown
  );
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const totalMatchesText = `${totalResults} ${maybePluralize(totalResults, 'result')}`;

  return (
    <Box m="0 auto">
      <Box mr={{ base: '14px', md: '2px' }} textAlign="right">
        <Tag.Root colorPalette="gray" fontSize="0.84rem" mb="24px" size="lg">
          {totalMatchesText}
        </Tag.Root>
      </Box>

      <Stack gap={5} m="0 auto" w={{ base: '96%', md: '500px' }}>
        {shows.map(show => (
          <SearchResult
            key={show.id}
            showToDisplay={show}
            followedShows={followedShows}
            hasLocalWarningToastBeenShown={hasLocalWarningToastBeenShown}
            isLoggedIn={isLoggedIn}
            removeFromFollowedShows={(showId: number) =>
              dispatch(removeFromFollowedShowsAction(showId))
            }
            saveToFollowedShows={(showId: number) =>
              dispatch(saveToFollowedShowsAction(showId))
            }
            setHasLocalWarningToastBeenShown={() =>
              dispatch(setHasLocalWarningToastBeenShownAction())
            }
          />
        ))}
      </Stack>
    </Box>
  );
};

export default SearchResults;
