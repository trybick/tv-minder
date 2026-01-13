import '@fontsource/dm-sans';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { App } from './app/App';
import { Provider as ChakraProviderWithSystem } from './components/ui/provider';
import { persistor, store } from './store';

const WrappedApp = () => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID!}
        >
          <ChakraProviderWithSystem>
            <App />
          </ChakraProviderWithSystem>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<WrappedApp />);
