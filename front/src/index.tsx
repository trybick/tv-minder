import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import App from './components/App';
import theme from './theme';

const RenderedApp = (): JSX.Element => (
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <App />
    </ThemeProvider>
  </StrictMode>
);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
