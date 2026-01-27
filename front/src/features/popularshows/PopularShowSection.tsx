import {
  Box,
  Button,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';

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
        <ShowCard.Grid mt="14px">
          {visibleShows.map(show => (
            <PopularShowCard key={show.id} show={show} />
          ))}
        </ShowCard.Grid>
      </Box>

      {!isExpanded && shows.length > minShowsToRender && (
        <Button
          colorPalette="cyan"
          mt="30px"
          mx="auto"
          display="flex"
          onClick={handleToggle}
          variant="plain"
          color="fg.muted"
        >
          <Text
            fontSize="md"
            _hover={{
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            See More
          </Text>
          <AiOutlineCaretDown style={{ width: '15px' }} />
        </Button>
      )}
    </>
  );
};
