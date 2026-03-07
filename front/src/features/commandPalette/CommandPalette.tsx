import { Box, Flex, Image } from '@chakra-ui/react';
import { Command } from 'cmdk';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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

type CommandPaletteContextType = {
  openPalette: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(
  null
);

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error(
      'useCommandPalette must be used within CommandPaletteProvider'
    );
  }
  return context;
};

type Props = {
  children: ReactNode;
};

export const CommandPaletteProvider = ({ children }: Props) => {
  const [, navigate] = useLocation();
  const { getImageUrl } = useImageUrl();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TmdbShowSummary[]>([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  const trackedShows = useAppSelector(selectTrackedShowsDetails);
  const recentShows = useAppSelector(selectRecentShows);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const filteredTrackedShows = trackedShows.filter(show =>
    show.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const availablePages = PAGES.filter(page => !page.requiresAuth || isLoggedIn);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const firstSelectableValue = !normalizedSearchTerm
    ? recentShows[0]
      ? `${recentShows[0].name} ${recentShows[0].id}`
      : (availablePages[0]?.name ?? '')
    : filteredTrackedShows[0]
      ? `${filteredTrackedShows[0].name} ${filteredTrackedShows[0].id}`
      : tmdbResults[0]
        ? `${tmdbResults[0].name} ${tmdbResults[0].id}`
        : (availablePages.find(page =>
            page.name.toLowerCase().includes(normalizedSearchTerm)
          )?.name ?? '');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        trackEvent({
          category: 'Command Palette',
          action: 'Opened via Keyboard Shortcut',
        });
        setIsOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // TMDB search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    const trackedIds = new Set(trackedShows.map(s => s.id));
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
  }, [searchTerm, filteredTrackedShows.length, trackedShows]);

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

  const handleNavigateToShow = (showId: number) => {
    setIsOpen(false);
    navigate(`${ROUTES.SHOW}/${showId}`);
  };

  const handleNavigateToPage = (route: string) => {
    setIsOpen(false);
    navigate(route);
  };

  const handleClose = () => setIsOpen(false);

  const contextValue = { openPalette: () => setIsOpen(true) };

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}

      <Command.Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        value={selectedValue}
        onValueChange={setSelectedValue}
        filter={(value, search, keywords) => {
          const normalizedSearch = search.trim().toLowerCase();
          if (!normalizedSearch) {
            return 1;
          }

          const normalizedValue = value.toLowerCase();
          const matchesValue = normalizedValue.includes(normalizedSearch);
          if (matchesValue) {
            return 1;
          }

          const hasKeywordMatch = (keywords ?? []).some(keyword =>
            keyword.toLowerCase().includes(normalizedSearch)
          );

          return hasKeywordMatch ? 1 : 0;
        }}
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

            {/* Recent Shows */}
            {!searchTerm && recentShows.length > 0 && (
              <Command.Group heading="Recently Viewed" className="cmdk-group">
                {recentShows.slice(0, 5).map(show => (
                  <Command.Item
                    key={`recent-${show.id}`}
                    value={`${show.name} ${show.id}`}
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

            {/* Tracked Shows - before search results and pages */}
            {filteredTrackedShows.length > 0 && (
              <Command.Group heading="Tracking" className="cmdk-group">
                {filteredTrackedShows.slice(0, 8).map(show => (
                  <Command.Item
                    key={`tracked-${show.id}`}
                    value={`${show.name} ${show.id}`}
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

            {/* TMDB Search Results */}
            {tmdbResults.length > 0 && (
              <Command.Group heading="Search Results" className="cmdk-group">
                {tmdbResults.map(show => (
                  <Command.Item
                    key={`tmdb-${show.id}`}
                    value={`${show.name} ${show.id}`}
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

            {/* Pages - use exact keywords to prevent fuzzy matching */}
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
    </CommandPaletteContext.Provider>
  );
};
