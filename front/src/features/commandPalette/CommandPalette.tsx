import { Box, Flex, Image } from '@chakra-ui/react';
import { Command } from 'cmdk';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

import { ROUTES } from '~/app/routes';
import { useImageUrl } from '~/hooks/useImageUrl';
import { useNavigateWithAnimation } from '~/hooks/useNavigateWithAnimation';
import { useAppSelector } from '~/store';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { selectFollowedShowsDetails } from '~/store/tv/selectors';
import { searchShowsByQuery } from '~/store/tv/services/searchShowsByQuery';
import { type TmdbShowSummary } from '~/store/tv/types/tmdbSchema';
import { getRecentShows } from '~/utils/recentShows';

import './commandPalette.css';

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

// Context for opening the command palette
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
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TmdbShowSummary[]>([]);
  const [isSearchingTmdb, setIsSearchingTmdb] = useState(false);
  const [recentShows, setRecentShows] = useState<
    ReturnType<typeof getRecentShows>
  >([]);
  const searchTimeoutRef = useRef<number | null>(null);

  const navigate = useNavigateWithAnimation();
  const followedShows = useAppSelector(selectFollowedShowsDetails);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const { getImageUrl } = useImageUrl();

  // Load recent shows when palette opens
  useEffect(() => {
    if (isOpen) {
      setRecentShows(getRecentShows());
    }
  }, [isOpen]);

  // Filter followed shows by search query
  const filteredFollowedShows = followedShows.filter(show =>
    show.name.toLowerCase().includes(search.toLowerCase())
  );

  // Available pages based on auth state
  const availablePages = PAGES.filter(page => !page.requiresAuth || isLoggedIn);

  // Toggle command palette with Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Search TMDB when query changes and no followed show matches
  useEffect(() => {
    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    const trimmedSearch = search.trim();

    // Don't search TMDB if:
    // - Query is too short
    // - We have matching followed shows
    if (trimmedSearch.length < 2 || filteredFollowedShows.length > 0) {
      setTmdbResults([]);
      setIsSearchingTmdb(false);
      return;
    }

    setIsSearchingTmdb(true);

    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        const { results } = await searchShowsByQuery(trimmedSearch);
        // Filter out shows already in followed shows
        const followedIds = new Set(followedShows.map(s => s.id));
        setTmdbResults(results.filter(r => !followedIds.has(r.id)).slice(0, 8));
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
  }, [search, filteredFollowedShows.length, followedShows]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setTmdbResults([]);
    }
  }, [isOpen]);

  const handleNavigateToShow = useCallback(
    (showId: number) => {
      setIsOpen(false);
      navigate(`${ROUTES.SHOW}/${showId}`);
    },
    [navigate]
  );

  const handleNavigateToPage = useCallback(
    (route: string) => {
      setIsOpen(false);
      navigate(route);
    },
    [navigate]
  );

  const openPalette = useCallback(() => {
    setIsOpen(true);
  }, []);

  const contextValue = useMemo(() => ({ openPalette }), [openPalette]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      {children}

      <Command.Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        label="Command Palette"
        className="cmdk-dialog"
        loop
      >
        {/* Explicit backdrop for click-to-close */}
        <Box className="cmdk-backdrop" onClick={handleClose} />

        <Box className="cmdk-wrapper">
          <Flex className="cmdk-input-wrapper">
            <Command.Input
              value={search}
              onValueChange={setSearch}
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

            {/* Recent Shows - only show when not searching */}
            {!search && recentShows.length > 0 && (
              <Command.Group heading="Recent" className="cmdk-group">
                {recentShows.slice(0, 5).map(show => (
                  <Command.Item
                    key={`recent-${show.id}`}
                    value={`recent-${show.name}-${show.id}`}
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

            {/* TMDB Search Results */}
            {tmdbResults.length > 0 && (
              <Command.Group heading="Search Results" className="cmdk-group">
                {tmdbResults.map(show => (
                  <Command.Item
                    key={`tmdb-${show.id}`}
                    value={`tmdb-${show.name}-${show.id}`}
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
                    {show.first_air_date && (
                      <span className="cmdk-item-year">
                        ({show.first_air_date.slice(0, 4)})
                      </span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Pages */}
            <Command.Group heading="Pages" className="cmdk-group">
              {availablePages.map(page => {
                const Icon = page.icon;
                return (
                  <Command.Item
                    key={page.route}
                    value={`page-${page.name}`}
                    onSelect={() => handleNavigateToPage(page.route)}
                    className="cmdk-item"
                  >
                    <Icon className="cmdk-item-icon" />
                    <span>{page.name}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>

            {/* Followed Shows */}
            {filteredFollowedShows.length > 0 && (
              <Command.Group heading="Following" className="cmdk-group">
                {filteredFollowedShows.slice(0, 8).map(show => (
                  <Command.Item
                    key={`followed-${show.id}`}
                    value={`followed-${show.name}`}
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
                    <span className="cmdk-item-badge">Following</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Box>
      </Command.Dialog>
    </CommandPaletteContext.Provider>
  );
};
