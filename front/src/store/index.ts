import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { followReducer, FollowReducerState } from './follows/reducers';

export type AppState = {
  followReduer: FollowReducerState;
};

const rootReducer = combineReducers({
  followReducer,
});

const middlewares = [thunk];
const appliedMiddleware = applyMiddleware(...middlewares);

export default createStore(rootReducer, composeWithDevTools(appliedMiddleware));
