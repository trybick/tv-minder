import { Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { Route, Switch, useLocation } from 'wouter';

import { ROUTES } from '~/constants/routes';
import { gAnalyticsID } from '~/constants/strings';
import CalendarPage from '~/pages/CalendarPage';
import FollowingPage from '~/pages/FollowingPage';
import SearchPage from '~/pages/SearchPage';
import SettingsPage from '~/pages/SettingsPage';
import ShowPage from '~/pages/ShowPage';
import { useAppDispatch, useAppSelector } from '~/store';
import { fetchfollowedShowsAction } from '~/store/user/actions';
import { selectIsLoggedIn } from '~/store/user/selectors';
import { initSentry } from '~/utils/sentry';

import ErrorBoundary from './common/ErrorBoundary';
import ProtectedRoute from './common/ProtectedRoute';
import ScrollToTop from './common/ScrollToTop';
import Footer from './footer/Footer';
import Header from './header/Header';
import { Toaster } from './ui/toaster';

const App = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [location] = useLocation();

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

      <Flex
        direction="column"
        minH="97vh"
        viewTransitionName={`page-${location}`}
      >
        <Header />

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
