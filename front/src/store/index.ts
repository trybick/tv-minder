import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { followReducer, FollowReducerState } from './follows/reducers';
import { userReducer, UserReducerState } from './user/reducers';

export type AppState = {
  followReducer: FollowReducerState;
  userReducer: UserReducerState;
};

const rootReducer = combineReducers({
  followReducer,
  userReducer,
});

const middlewares = [thunk];
const appliedMiddleware = applyMiddleware(...middlewares);

export default createStore(rootReducer, composeWithDevTools(appliedMiddleware));
