import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';

import { ErrorBoundary } from '~/components/ErrorBoundary';
import { Modals } from '~/components/Modals';
import { ProtectedRoute } from '~/components/ProtectedRoute';
import { Toaster } from '~/components/ui/toaster';
import { CalendarPage } from '~/features/calendar/CalendarPage';
import { CommandPaletteProvider } from '~/features/commandPalette';
import { Footer } from '~/features/footer/Footer';
import { HeaderDesktop } from '~/features/header/HeaderDesktop';
import { HeaderMobile } from '~/features/header/HeaderMobile';
import { SearchPage } from '~/features/search/SearchPage';
import { SettingsPage } from '~/features/settings/SettingsPage';
import { ShowPage } from '~/features/show/ShowPage';
import { TrackingPage } from '~/features/tracking/TrackingPage';
import { useResponsiveLayout } from '~/hooks/useResponsiveLayout';
import { useAppSelector } from '~/store';
import { useGetTrackedShowsQuery } from '~/store/rtk/api/track.api';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { initAnalytics, trackPageview } from '~/utils/analytics';
import { gAnalyticsID } from '~/utils/constants';
import { initSentry } from '~/utils/sentry';

import { ROUTES } from './routes';

// This wrapper fixes going back a page but the page not changing.
export const App = () => {
  const { isMobile } = useResponsiveLayout();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [location] = useLocation();

  useGetTrackedShowsQuery(undefined, {
    skip: !isLoggedIn,
    refetchOnMountOrArgChange: true,
    selectFromResult: () => ({}),
  });

  useEffect(() => {
    initAnalytics(gAnalyticsID);
    initSentry();
  }, []);

  useEffect(() => {
    trackPageview(location);
  }, [location]);

  return (
    <ErrorBoundary>
      <CommandPaletteProvider>
        <Toaster />
        <Modals />

        <Flex direction="column" minH="100vh" flex="1">
          {isMobile ? <HeaderMobile /> : <HeaderDesktop />}

          <Switch>
            <Route path={ROUTES.HOME}>
              <SearchPage />
            </Route>
            <Route path={ROUTES.CALENDAR}>
              <CalendarPage />
            </Route>

            <Route path={ROUTES.MANAGE}>
              <ProtectedRoute>
                <TrackingPage />
              </ProtectedRoute>
            </Route>
            <Route path={ROUTES.SETTINGS}>
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            </Route>

            <Route path={`${ROUTES.SHOW}/:showId`}>
              <ShowPage />
            </Route>
          </Switch>
        </Flex>

        <Footer />
      </CommandPaletteProvider>
    </ErrorBoundary>
  );
};
