import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import 'focus-visible/dist/focus-visible';
import configureStore from 'store';
import App from 'components/App';
import { initSentry } from 'utils/sentry';
import theme from './theme';

initSentry();

const { store, persistor } = configureStore();

const WrappedApp = (): JSX.Element => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID!}>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
          </ChakraProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<WrappedApp />);
