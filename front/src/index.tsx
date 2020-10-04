import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ReactDOM from 'react-dom';
import configureStore from 'store';
import { ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/core';
import App from 'components/App';
import theme from './theme';

const { store, persistor } = configureStore();

const RenderedApp = (): JSX.Element => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ColorModeProvider>
            <CSSReset />
            <App />
          </ColorModeProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
