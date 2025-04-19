import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from 'components/App';
import { persistor, store } from 'store';
import { Provider as ChakraProvider } from './components/ui/provider';

const WrappedApp = () => (
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID!}
        >
          <ChakraProvider defaultTheme="dark">
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
