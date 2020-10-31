import React, { useEffect } from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Flex } from '@chakra-ui/core';
import ReactGA from 'react-ga';
import { AppState, AppThunkDispatch, AppThunkPlainAction } from 'store';
import { fetchfollowedShowsAction } from 'store/user/actions';
import { selectIsLoggedIn } from 'store/user/selectors';
import { gAnalyticsID } from 'utils/constants';
import Header from 'components/header/Header';
import Footer from 'components/footer/Footer';
import ProtectedRoute from 'components/common/ProtectedRoute';
import ErrorBoundary from 'components/common/ErrorBoundary';
import SearchPage from 'pages/SearchPage';
import CalendarPage from 'pages/CalendarPage';
import MyShowsPage from 'pages/MyShowsPage';
import SettingsPage from 'pages/SettingsPage';

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
        <ErrorBoundary>
          <Switch>
            <Route path="/" exact>
              <SearchPage />
            </Route>
            <Route path="/calendar">
              <CalendarPage />
            </Route>
            <Route path="/my-shows">
              <MyShowsPage />
            </Route>
            <Route path="/settings">
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
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
