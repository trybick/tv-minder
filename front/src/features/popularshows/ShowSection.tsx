import { Box, Button, Grid, Text, useDisclosure } from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';

import { type ShowItem } from '~/components/ShowCard';
import { applyViewTransition } from '~/utils/applyViewTransition';

import { PopularShowCard } from './PopularShowCard';

export const COLUMNS_PER_BREAKPOINT = {
  base: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
} as const;

type Props = {
  shows: ShowItem[];
};

export const ShowSection = ({ shows }: Props) => {
  const { open: isExpanded, onToggle } = useDisclosure();

  const handleToggle = () => {
    applyViewTransition(onToggle);
  };

  // When collapsed, show enough items to fill one row at the largest breakpoint (2xl = 6).
  // On smaller screens this may result in 2-3 rows, which is an acceptable trade-off
  // to avoid needing useBreakpointValue and the complexity it adds.
  const visibleShows = isExpanded
    ? shows
    : shows.slice(0, COLUMNS_PER_BREAKPOINT['2xl']);

  return (
    <>
      <Box position="relative">
        <Grid
          templateColumns={{
            base: `repeat(${COLUMNS_PER_BREAKPOINT.base}, 1fr)`,
            md: `repeat(${COLUMNS_PER_BREAKPOINT.md}, 1fr)`,
            lg: `repeat(${COLUMNS_PER_BREAKPOINT.lg}, 1fr)`,
            xl: `repeat(${COLUMNS_PER_BREAKPOINT.xl}, 1fr)`,
            '2xl': `repeat(${COLUMNS_PER_BREAKPOINT['2xl']}, 1fr)`,
          }}
          gap="34px 30px"
          mt="14px"
        >
          {visibleShows.map(show => (
            <PopularShowCard key={show.id} show={show} />
          ))}
        </Grid>
      </Box>

      {!isExpanded && shows.length > COLUMNS_PER_BREAKPOINT['2xl'] && (
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
