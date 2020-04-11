import React from 'react';
import ReactDOM from 'react-dom';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import App from './components/App';

const RenderedApp = () => (
  <React.StrictMode>
    <ThemeProvider>
      <CSSReset />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
