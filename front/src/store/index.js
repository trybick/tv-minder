import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { userFollowsReducer } from './reducers';

const rootReducer = combineReducers({
  userFollows: userFollowsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
