import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Route, Switch } from 'wouter';

import ErrorBoundary from '~/components/ErrorBoundary';
import ProtectedRoute from '~/components/ProtectedRoute';
import ScrollToTop from '~/components/ScrollToTop';
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
import { useAppDispatch, useAppSelector } from '~/store';
import { fetchfollowedShowsAction } from '~/store/user/actions';
import { selectIsLoggedIn } from '~/store/user/selectors';
import { gAnalyticsID } from '~/utils/constants';
import { initSentry } from '~/utils/sentry';

import { ROUTES } from './routes';

const App = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchfollowedShowsAction());
    }
    if (import.meta.env.MODE === 'production') {
      ReactGA.initialize(gAnalyticsID);
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
      initSentry();
    }
  }, [isLoggedIn, dispatch]);

  return (
    <>
      <ScrollToTop />
      <Toaster />

      <Flex direction="column" minH="97vh">
        {isMobile ? <MobileHeader /> : <DesktopHeader />}

        <ErrorBoundary>
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
        </ErrorBoundary>
      </Flex>

      <Footer />
    </>
  );
};

export default App;
