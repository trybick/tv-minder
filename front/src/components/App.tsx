import React, { useEffect } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Flex } from '@chakra-ui/core';
import ReactGA from 'react-ga';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { fetchfollowedShowsAction } from 'store/user/actions';
import { selectIsLoggedIn } from 'store/user/selectors';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import SearchPage from 'pages/SearchPage';
import CalendarPage from 'pages/CalendarPage';
import MyShowsPage from 'pages/MyShowsPage';
import { gAnalyticsID } from 'utils/constants';
import ProtectedRoute from './common/ProtectedRoute';
import SettingsPage from 'pages/SettingsPage';
import ErrorBoundary from './common/ErrorBoundary';

interface StateProps {
  isLoggedIn: boolean;
}

interface DispatchProps {
  fetchfollowedShows: AppThunkPlainAction;
}

type Props = StateProps & DispatchProps;

const App = ({ isLoggedIn, fetchfollowedShows }: Props) => {
  useEffect(() => {
    ReactGA.initialize(gAnalyticsID);
    ReactGA.pageview(window.location.pathname);

    if (isLoggedIn) {
      fetchfollowedShows();
    }
  }, [isLoggedIn, fetchfollowedShows]);

  return (
    <Router>
      <Flex direction="column" minH="97vh">
        <Header />

        <Switch>
          <Route path="/" exact>
            <ErrorBoundary>
              <SearchPage />
            </ErrorBoundary>
          </Route>
          <Route path="/calendar">
            <ErrorBoundary>
              <CalendarPage />
            </ErrorBoundary>
          </Route>
          <Route path="/my-shows">
            <ErrorBoundary>
              <MyShowsPage />
            </ErrorBoundary>
          </Route>
          <Route path="/settings">
            <ProtectedRoute>
              <ErrorBoundary>
                <SettingsPage />
              </ErrorBoundary>
            </ProtectedRoute>
          </Route>
        </Switch>
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
