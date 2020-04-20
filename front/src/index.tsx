import React from 'react';
import ReactDOM from 'react-dom';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import App from './components/App';
import theme from './theme';

const RenderedApp = (): JSX.Element => (
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
