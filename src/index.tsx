import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@chakra-ui/core';
import App from './components/App';

const RenderedApp = () => (
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

ReactDOM.render(<RenderedApp />, document.getElementById('root'));
