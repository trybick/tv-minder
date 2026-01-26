import {
  Box,
  Button,
  Grid,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AiOutlineCaretDown } from 'react-icons/ai';

import { type ShowItem } from '~/components/ShowCard';
import { applyViewTransition } from '~/utils/applyViewTransition';

import { PopularShowCard } from './PopularShowCard';

const columnsByBreakpoint = {
  base: 2,
  md: 3,
  lg: 4,
  xl: 5,
  '2xl': 6,
} as const;

const templateColumns = Object.fromEntries(
  Object.entries(columnsByBreakpoint).map(([key, value]) => [
    key,
    `repeat(${value}, 1fr)`,
  ])
);

type Props = {
  shows: ShowItem[];
};

export const PopularShowSection = ({ shows }: Props) => {
  const { open: isExpanded, onToggle } = useDisclosure();

  const minShowsToRender =
    useBreakpointValue(columnsByBreakpoint, { ssr: false }) ??
    columnsByBreakpoint.base;

  const visibleShows = isExpanded ? shows : shows.slice(0, minShowsToRender);

  const handleToggle = () => {
    applyViewTransition(onToggle);
  };

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
