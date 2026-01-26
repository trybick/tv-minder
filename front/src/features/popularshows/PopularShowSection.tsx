import { Box, Button, Grid, Text, useDisclosure } from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';

import { type ShowItem } from '~/components/ShowCard';
import { applyViewTransition } from '~/utils/applyViewTransition';

import { PopularShowCard } from './PopularShowCard';

const templateColumns = {
  base: 'repeat(2, 1fr)',
  md: `repeat(3, 1fr)`,
  lg: `repeat(4, 1fr)`,
  xl: `repeat(5, 1fr)`,
  '2xl': `repeat(6, 1fr)`,
} as const;

type Props = {
  shows: ShowItem[];
};

export const PopularShowSection = ({ shows }: Props) => {
  const { open: isExpanded, onToggle } = useDisclosure();

  const handleToggle = () => {
    applyViewTransition(onToggle);
  };

  // When collapsed, show enough items to fill one row at the largest breakpoint (2xl = 6).
  // On smaller screens this may result in 2-3 rows, which is an acceptable trade-off
  // to avoid needing useBreakpointValue and the complexity it adds.
  const minShowsToRender = 6;
  const visibleShows = isExpanded ? shows : shows.slice(0, minShowsToRender);

  return (
    <>
      <Box position="relative">
        <Grid templateColumns={templateColumns} gap="34px 30px" mt="14px">
          {visibleShows.map(show => (
            <PopularShowCard key={show.id} show={show} />
          ))}
        </Grid>
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
