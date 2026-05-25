import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { App } from './App';
import { GlobalStyles } from './styles/GlobalStyles';
import { darkTheme, lightTheme } from './styles/theme';
import { useUIStore } from './store/uiStore';

function Root() {
  const theme = useUIStore(s => s.theme);
  const activeTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  );
}

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('No root element');
ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
