import React, { StrictMode } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import store from 'store';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import App from 'components/App';
import theme from './theme';

const RenderedApp = (): JSX.Element => (
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
