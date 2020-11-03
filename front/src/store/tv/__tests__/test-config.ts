import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

// Mock redux store config for dispathing action
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
export const returnWithStore = (args?: any) => mockStore(args);
