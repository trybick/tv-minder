import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { connect, MapStateToProps } from 'react-redux';
import { Route, Switch } from 'wouter';
import ErrorBoundary from 'components/common/ErrorBoundary';
import ProtectedRoute from 'components/common/ProtectedRoute';
import Footer from 'components/footer/Footer';
import Header from 'components/header/Header';
import { ROUTES } from 'constants/routes';
import { gAnalyticsID } from 'constants/strings';
import CalendarPage from 'pages/CalendarPage';
import FollowingPage from 'pages/FollowingPage';
import SearchPage from 'pages/SearchPage';
import SettingsPage from 'pages/SettingsPage';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { fetchfollowedShowsAction } from 'store/user/actions';
import { selectIsLoggedIn } from 'store/user/selectors';
import { initSentry } from 'utils/sentry';
import ScrollToTop from './common/ScrollToTop';
import ShowPage from 'pages/ShowPage';
import { Toaster } from './ui/toaster';

type StateProps = {
  isLoggedIn: boolean;
};

type DispatchProps = {
  fetchfollowedShows: AppThunkPlainAction;
};

type Props = StateProps & DispatchProps;

const App = ({ isLoggedIn, fetchfollowedShows }: Props) => {
  useEffect(() => {
    if (isLoggedIn) {
      fetchfollowedShows();
    }
    if (import.meta.env.MODE === 'production') {
      ReactGA.initialize(gAnalyticsID);
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
      initSentry();
    }
  }, [isLoggedIn, fetchfollowedShows]);

  return (
    <>
      <ScrollToTop />
      <Toaster />

      <Flex direction="column" minH="97vh">
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

const mapStateToProps: MapStateToProps<StateProps, {}, AppState> = (
  state: AppState
): StateProps => ({
  isLoggedIn: selectIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
  fetchfollowedShows: () => dispatch(fetchfollowedShowsAction()),
});

export default connect<StateProps, DispatchProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(App);
