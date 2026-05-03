import { Box, Flex, Image } from '@chakra-ui/react';
import { Command } from 'cmdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MdCalendarToday,
  MdClose,
  MdHistory,
  MdHome,
  MdViewList,
} from 'react-icons/md';
import { useLocation } from 'wouter';

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useAppSelector } from '~/store';
import { selectRecentShows } from '~/store/rtk/slices/recentShows.slice';
import { selectTrackedShows } from '~/store/rtk/slices/user.selectors';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { selectTrackedShowsDetails } from '~/store/tv/selectors';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { trackEvent } from '~/utils/analytics';

import './commandPalette.css';
import { fetchResults, filterOutTrackedShows } from './searchHelpers';

const PAGES = [
  { name: 'Discover', route: ROUTES.HOME, icon: MdHome, requiresAuth: false },
  {
    name: 'Calendar',
    route: ROUTES.CALENDAR,
    icon: MdCalendarToday,
    requiresAuth: false,
  },
  {
    name: 'Manage Shows',
    route: ROUTES.MANAGE,
    icon: MdViewList,
    requiresAuth: true,
  },
];

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const CommandPaletteDialog = ({ isOpen, setIsOpen }: Props) => {
  const [, navigate] = useLocation();
  const { getImageUrl } = useImageUrl();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TmdbShowSummary[]>([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const trackedShowIds = useAppSelector(selectTrackedShows);
  const trackedShows = useAppSelector(selectTrackedShowsDetails);
  const recentShows = useAppSelector(selectRecentShows);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const trackedIds = useMemo(() => new Set(trackedShowIds), [trackedShowIds]);

  const filteredTrackedShows = trackedShows.filter(show =>
    show.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const availablePages = PAGES.filter(page => !page.requiresAuth || isLoggedIn);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const firstSelectableValue = !normalizedSearchTerm
    ? recentShows[0]
      ? `recent-${recentShows[0].id}-${recentShows[0].name}`
      : (availablePages[0]?.name ?? '')
    : filteredTrackedShows[0]
      ? `tracked-${filteredTrackedShows[0].id}-${filteredTrackedShows[0].name}`
      : tmdbResults[0]
        ? `tmdb-${tmdbResults[0].id}-${tmdbResults[0].name}`
        : (availablePages.find(page =>
            page.name.toLowerCase().includes(normalizedSearchTerm)
          )?.name ?? '');

  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    const query = searchTerm.trim();
    const shouldSkipSearch =
      query.length < 2 || filteredTrackedShows.length > 0;

    if (shouldSkipSearch) {
      setTmdbResults([]);
      setIsSearchingTmdb(false);
      return;
    }

    setIsSearchingTmdb(true);

    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        trackEvent({
          category: 'Command Palette',
          action: 'Performed Search',
          label: query,
        });
        const results = await fetchResults(query);
        setTmdbResults(filterOutTrackedShows(results, trackedIds));
      } catch {
        setTmdbResults([]);
      } finally {
        setIsSearchingTmdb(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, filteredTrackedShows.length, trackedIds]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedValue('');
      setTmdbResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !firstSelectableValue) {
      return;
    }

    setSelectedValue(prev =>
      prev === firstSelectableValue ? prev : firstSelectableValue
    );
  }, [firstSelectableValue, isOpen]);

  const handleNavigateToShow = useCallback(
    (showId: number) => {
      setIsOpen(false);
      navigate(`${ROUTES.SHOW}/${showId}`);
    },
    [setIsOpen, navigate]
  );

  const handleNavigateToPage = useCallback(
    (route: string) => {
      setIsOpen(false);
      navigate(route);
    },
    [setIsOpen, navigate]
  );

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  const filterCommand = useCallback(
    (value: string, search: string, keywords?: string[]) => {
      const normalizedSearch = search.trim().toLowerCase();
      if (!normalizedSearch) {
        return 1;
      }

      const normalizedValue = value.toLowerCase();
      if (normalizedValue.includes(normalizedSearch)) {
        return 1;
      }

      const hasKeywordMatch = (keywords ?? []).some(keyword =>
        keyword.toLowerCase().includes(normalizedSearch)
      );

      return hasKeywordMatch ? 1 : 0;
    },
    []
  );

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      value={selectedValue}
      onValueChange={setSelectedValue}
      filter={filterCommand}
      label="Command Palette"
      className="cmdk-dialog"
      loop
    >
      <Box className="cmdk-backdrop" onClick={handleClose} />

      <Box className="cmdk-wrapper">
        <Flex className="cmdk-input-wrapper">
          <Command.Input
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search shows, navigate pages..."
            className="cmdk-input"
          />
          <Box
            as="button"
            onClick={handleClose}
            className="cmdk-close-button"
            aria-label="Close"
          >
            <MdClose size={18} />
          </Box>
        </Flex>

        <Command.List className="cmdk-list">
          <Command.Empty className="cmdk-empty">
            {isSearchingTmdb ? 'Searching...' : 'No results found.'}
          </Command.Empty>

          {!searchTerm && recentShows.length > 0 && (
            <Command.Group heading="Recently Viewed" className="cmdk-group">
              {recentShows.slice(0, 5).map(show => (
                <Command.Item
                  key={`recent-${show.id}`}
                  value={`recent-${show.id}-${show.name}`}
                  onSelect={() => handleNavigateToShow(show.id)}
                  className="cmdk-item"
                >
                  <Image
                    src={getImageUrl({ path: show.posterPath })}
                    alt={show.name}
                    className="cmdk-item-poster"
                    loading="lazy"
                  />
                  <span className="cmdk-item-name">{show.name}</span>
                  <MdHistory className="cmdk-item-icon-right" />
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {filteredTrackedShows.length > 0 && (
            <Command.Group heading="Tracking" className="cmdk-group">
              {filteredTrackedShows.slice(0, 8).map(show => (
                <Command.Item
                  key={`tracked-${show.id}`}
                  value={`tracked-${show.id}-${show.name}`}
                  keywords={[show.name.toLowerCase()]}
                  onSelect={() => handleNavigateToShow(show.id)}
                  className="cmdk-item"
                >
                  <Image
                    src={getImageUrl({ path: show.posterPath })}
                    alt={show.name}
                    className="cmdk-item-poster"
                    loading="lazy"
                  />
                  <span className="cmdk-item-name">{show.name}</span>
                  <span className="cmdk-item-badge">Tracking</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {tmdbResults.length > 0 && (
            <Command.Group heading="Search Results" className="cmdk-group">
              {tmdbResults.map(show => (
                <Command.Item
                  key={`tmdb-${show.id}`}
                  value={`tmdb-${show.id}-${show.name}`}
                  onSelect={() => handleNavigateToShow(show.id)}
                  className="cmdk-item"
                >
                  <Image
                    src={getImageUrl({ path: show.poster_path })}
                    alt={show.name}
                    className="cmdk-item-poster"
                    loading="lazy"
                  />
                  <span className="cmdk-item-name">{show.name}</span>
                  {show.first_air_date && show.first_air_date.length >= 4 && (
                    <span className="cmdk-item-year">
                      ({show.first_air_date.slice(0, 4)})
                    </span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          <Command.Group heading="Pages" className="cmdk-group">
            {availablePages.map(page => {
              const Icon = page.icon;
              return (
                <Command.Item
                  key={page.route}
                  value={page.name}
                  keywords={[page.name.toLowerCase()]}
                  onSelect={() => handleNavigateToPage(page.route)}
                  className="cmdk-item"
                >
                  <Icon className="cmdk-item-icon" />
                  <span>{page.name}</span>
                </Command.Item>
              );
            })}
          </Command.Group>
        </Command.List>
      </Box>
    </Command.Dialog>
  );
};
