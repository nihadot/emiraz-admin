import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import { Provider } from 'react-redux';
// import { store } from './store';
import { BrowserRouter } from 'react-router';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  // </StrictMode>
);