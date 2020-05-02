import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { userFollowsReducer } from './follows/reducers';

const rootReducer = combineReducers({
  userFollows: userFollowsReducer,
});

const middlewares = [thunk];
const appliedMiddleware = applyMiddleware(...middlewares);

export default createStore(rootReducer, composeWithDevTools(appliedMiddleware));
