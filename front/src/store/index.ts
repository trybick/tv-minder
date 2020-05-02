import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { userFollowsReducer } from './follows/reducers';

const rootReducer = combineReducers({
  userFollows: userFollowsReducer,
});

function configureStore() {
  const middlewares = [thunk];
  const appliedMiddleware = applyMiddleware(...middlewares);

  const store = createStore(rootReducer, composeWithDevTools(appliedMiddleware));

  return store;
}

export default configureStore();
