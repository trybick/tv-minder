import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Route, Switch } from 'wouter';

import ErrorBoundary from '~/components/ErrorBoundary';
import ProtectedRoute from '~/components/ProtectedRoute';
import { Toaster } from '~/components/ui/toaster';
import CalendarPage from '~/features/calendar/CalendarPage';
import FollowingPage from '~/features/following/FollowingPage';
import Footer from '~/features/footer/Footer';
import DesktopHeader from '~/features/header/HeaderDesktop';
import MobileHeader from '~/features/header/HeaderMobile';
import SearchPage from '~/features/search/SearchPage';
import SettingsPage from '~/features/settings/SettingsPage';
import ShowPage from '~/features/show/ShowPage';
import { useIsMobile } from '~/hooks/useIsMobile';
import { useAppSelector } from '~/store';
import { useGetFollowedShowsQuery } from '~/store/rtk/api/follow.api';
import { selectIsLoggedIn } from '~/store/rtk/slices/user.slice';
import { gAnalyticsID } from '~/utils/constants';
import { getIsProduction } from '~/utils/env';
import { initSentry } from '~/utils/sentry';

import { ROUTES } from './routes';

const App = () => {
  const isMobile = useIsMobile();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  useGetFollowedShowsQuery(undefined, {
    skip: !isLoggedIn,
    refetchOnMountOrArgChange: true,
    selectFromResult: () => ({}),
  });

  useEffect(() => {
    if (getIsProduction()) {
      ReactGA.initialize(gAnalyticsID);
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
      initSentry();
    }
  }, []);

  return (
    <ErrorBoundary>
      <Toaster />

      <Flex direction="column" minH="97vh">
        {isMobile ? <MobileHeader /> : <DesktopHeader />}

        <Switch>
          <Route path={ROUTES.HOME}>
            <SearchPage />
          </Route>
          <Route path={ROUTES.CALENDAR}>
            <CalendarPage />
          </Route>

          <Route path={ROUTES.MANAGE}>
            <ProtectedRoute>
              <FollowingPage />
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
    </ErrorBoundary>
  );
};

export default App;
