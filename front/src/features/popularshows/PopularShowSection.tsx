import {
  Box,
  Button,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { HiChevronDown } from 'react-icons/hi2';

import {
  ShowCard,
  showCardColumnsByBreakpoint,
  type ShowItem,
} from '~/components/ShowCard';
import { applyViewTransition } from '~/utils/applyViewTransition';

import { PopularShowCard } from './PopularShowCard';

type Props = {
  shows: ShowItem[];
};

export const PopularShowSection = ({ shows }: Props) => {
  const { open: isExpanded, onToggle } = useDisclosure();

  const minShowsToRender =
    useBreakpointValue(showCardColumnsByBreakpoint, { ssr: false }) ??
    showCardColumnsByBreakpoint.base;

  const visibleShows = isExpanded ? shows : shows.slice(0, minShowsToRender);

  const handleToggle = () => {
    applyViewTransition(onToggle);
  };

  return (
    <>
      <Box position="relative">
        <ShowCard.Grid>
          {visibleShows.map(show => (
            <PopularShowCard key={show.id} show={show} />
          ))}
        </ShowCard.Grid>
      </Box>

      {!isExpanded && shows.length > minShowsToRender && (
        <Button
          colorPalette="cyan"
          mt={8}
          mx="auto"
          display="flex"
          onClick={handleToggle}
          variant="outline"
          size="sm"
          borderColor="whiteAlpha.200"
          _hover={{
            bg: 'whiteAlpha.100',
            borderColor: 'cyan.500/50',
          }}
        >
          Show More
          <HiChevronDown />
        </Button>
      )}
    </>
  );
};
