import { useEffect } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import ReactGA from 'react-ga4';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { fetchfollowedShowsAction } from 'store/user/actions';
import { selectIsLoggedIn } from 'store/user/selectors';
import { gAnalyticsID } from 'constants/strings';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import ScrollToTop from './common/ScrollToTop';
import ProtectedRoute from 'components/common/ProtectedRoute';
import ErrorBoundary from 'components/common/ErrorBoundary';
import SearchPage from 'pages/SearchPage';
import CalendarPage from 'pages/CalendarPage';
import FollowingPage from 'pages/FollowingPage';
import SettingsPage from 'pages/SettingsPage';
import ShowPage from 'pages/ShowPage';
import { ROUTES } from 'constants/routes';
import { initSentry } from 'utils/sentry';

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
    <Router>
      <ScrollToTop />
      <Flex direction="column" minH="97vh">
        <Header />
        <ErrorBoundary>
          <Switch>
            <Route path={ROUTES.HOME} exact>
              <SearchPage />
            </Route>
            <Route path={ROUTES.CALENDAR}>
              <CalendarPage />
            </Route>
            <Route path={ROUTES.FOLLOWING}>
              <FollowingPage />
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
    </Router>
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
