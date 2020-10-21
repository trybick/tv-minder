import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

//mock redux store cofig for dispathing action
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
export const returnWithStore = (args?: any) => mockStore(args);
