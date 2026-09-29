import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

void import('@/services/firebase/client');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
