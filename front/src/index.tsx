import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ReactDOM from 'react-dom';
import configureStore from 'store';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import 'focus-visible/dist/focus-visible';
import App from 'components/App';
import theme from './theme';

const { store, persistor } = configureStore();

const RenderedApp = (): JSX.Element => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          {/* <CSSReset /> */}
          <App />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
