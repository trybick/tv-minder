import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import 'focus-visible/dist/focus-visible';
import configureStore from 'store';
import App from 'components/App';
import { initSentry } from 'utils/sentry';
import theme from './theme';

initSentry();

const { store, persistor } = configureStore();

const RenderedApp = (): JSX.Element => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
