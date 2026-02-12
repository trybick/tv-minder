import {
  Badge,
  Box,
  Button,
  HStack,
  IconButton,
  NativeSelect,
  Popover,
  Portal,
  Slider,
  Stack,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

import { type DiscoverFilters } from '~/store/tv/types/transformed';

const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 9648, name: 'Mystery' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
] as const;

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_count.desc', label: 'Most Voted' },
  { value: 'first_air_date.desc', label: 'Newest First' },
  { value: 'first_air_date.asc', label: 'Oldest First' },
] as const;

const EMPTY_FILTERS: DiscoverFilters = {
  sortBy: 'popularity.desc',
  genres: [],
  voteAverageGte: 0,
  firstAirDateGte: '',
  firstAirDateLte: '',
};

type Props = {
  onApply: (filters: DiscoverFilters) => void;
  onClear: () => void;
  activeFilterCount: number;
};

export const SearchFilters = ({
  onApply,
  onClear,
  activeFilterCount,
}: Props) => {
  const [draft, setDraft] = useState<DiscoverFilters>({ ...EMPTY_FILTERS });
  const [open, setOpen] = useState(false);

  const toggleGenre = useCallback((genreId: number) => {
    setDraft(prev => {
      const current = prev.genres ?? [];
      const next = current.includes(genreId)
        ? current.filter(id => id !== genreId)
        : [...current, genreId];
      return { ...prev, genres: next };
    });
  }, []);

  const handleApply = useCallback(() => {
    onApply(draft);
    setOpen(false);
  }, [draft, onApply]);

  const handleClear = useCallback(() => {
    setDraft({ ...EMPTY_FILTERS });
    onClear();
    setOpen(false);
  }, [onClear]);

  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const yearOptions = useMemo(() => {
    const years: { value: string; label: string }[] = [
      { value: '', label: 'Any' },
    ];
    for (let y = currentYear + 1; y >= 1950; y--) {
      years.push({ value: String(y), label: String(y) });
    }
    return years;
  }, [currentYear]);

  return (
    <Popover.Root
      open={open}
      onOpenChange={e => setOpen(e.open)}
      positioning={{ placement: 'bottom-end' }}
      lazyMount
      unmountOnExit
    >
      <Popover.Trigger asChild>
        <IconButton
          aria-label="Search filters"
          variant="plain"
          size="sm"
          color="fg.muted"
          _hover={{ color: 'fg' }}
          position="relative"
        >
          <HiOutlineAdjustmentsHorizontal size="20px" />
          {activeFilterCount > 0 && (
            <Badge
              colorPalette="cyan"
              variant="solid"
              position="absolute"
              top="-1"
              right="-1"
              borderRadius="full"
              minW="18px"
              h="18px"
              fontSize="2xs"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {activeFilterCount}
            </Badge>
          )}
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            w={{ base: '340px', md: '400px' }}
            bg="gray.900"
            borderColor="whiteAlpha.200"
            boxShadow="xl"
          >
            <Popover.Body p="5">
              <Stack gap="5">
                {/* Sort By */}
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="fg.muted"
                    mb="1.5"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Sort by
                  </Text>
                  <NativeSelect.Root size="sm" variant="outline">
                    <NativeSelect.Field
                      value={draft.sortBy ?? 'popularity.desc'}
                      onChange={e =>
                        setDraft(prev => ({
                          ...prev,
                          sortBy: e.currentTarget.value,
                        }))
                      }
                      bg="whiteAlpha.50"
                      borderColor="whiteAlpha.200"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>

                {/* Genres */}
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="fg.muted"
                    mb="2"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Genres
                  </Text>
                  <Wrap gap="1.5">
                    {TV_GENRES.map(genre => {
                      const isSelected = draft.genres?.includes(genre.id);
                      return (
                        <Button
                          key={genre.id}
                          size="xs"
                          variant={isSelected ? 'solid' : 'outline'}
                          colorPalette={isSelected ? 'cyan' : 'gray'}
                          borderColor={
                            isSelected ? 'cyan.500' : 'whiteAlpha.300'
                          }
                          onClick={() => toggleGenre(genre.id)}
                          fontWeight="normal"
                          borderRadius="full"
                          px="3"
                        >
                          {genre.name}
                        </Button>
                      );
                    })}
                  </Wrap>
                </Box>

                {/* Min Rating */}
                <Box>
                  <HStack justify="space-between" mb="2">
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="fg.muted"
                      textTransform="uppercase"
                      letterSpacing="wide"
                    >
                      Min Rating
                    </Text>
                    <Text fontSize="xs" color="fg.muted">
                      {(draft.voteAverageGte ?? 0) > 0
                        ? `${draft.voteAverageGte}+`
                        : 'Any'}
                    </Text>
                  </HStack>
                  <Slider.Root
                    size="sm"
                    colorPalette="cyan"
                    min={0}
                    max={9}
                    step={1}
                    value={[draft.voteAverageGte ?? 0]}
                    onValueChange={e =>
                      setDraft(prev => ({
                        ...prev,
                        voteAverageGte: e.value[0],
                      }))
                    }
                  >
                    <Slider.Control>
                      <Slider.Track>
                        <Slider.Range />
                      </Slider.Track>
                      <Slider.Thumbs />
                    </Slider.Control>
                  </Slider.Root>
                </Box>

                {/* Year Range */}
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="fg.muted"
                    mb="1.5"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    First Aired
                  </Text>
                  <HStack gap="3">
                    <NativeSelect.Root size="sm" flex="1">
                      <NativeSelect.Field
                        value={
                          draft.firstAirDateGte
                            ? draft.firstAirDateGte.slice(0, 4)
                            : ''
                        }
                        onChange={e => {
                          const year = e.currentTarget.value;
                          setDraft(prev => ({
                            ...prev,
                            firstAirDateGte: year ? `${year}-01-01` : '',
                          }));
                        }}
                        bg="whiteAlpha.50"
                        borderColor="whiteAlpha.200"
                      >
                        {yearOptions.map(opt => (
                          <option key={`from-${opt.value}`} value={opt.value}>
                            {opt.value ? `From ${opt.label}` : 'From'}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>

                    <Text color="fg.subtle" fontSize="sm">
                      —
                    </Text>

                    <NativeSelect.Root size="sm" flex="1">
                      <NativeSelect.Field
                        value={
                          draft.firstAirDateLte
                            ? draft.firstAirDateLte.slice(0, 4)
                            : ''
                        }
                        onChange={e => {
                          const year = e.currentTarget.value;
                          setDraft(prev => ({
                            ...prev,
                            firstAirDateLte: year ? `${year}-12-31` : '',
                          }));
                        }}
                        bg="whiteAlpha.50"
                        borderColor="whiteAlpha.200"
                      >
                        {yearOptions.map(opt => (
                          <option key={`to-${opt.value}`} value={opt.value}>
                            {opt.value ? `To ${opt.label}` : 'To'}
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  </HStack>
                </Box>

                {/* Actions */}
                <HStack gap="2" justify="flex-end" pt="1">
                  <Button
                    size="sm"
                    variant="ghost"
                    color="fg.muted"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                  <Button size="sm" colorPalette="cyan" onClick={handleApply}>
                    Apply Filters
                  </Button>
                </HStack>
              </Stack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
