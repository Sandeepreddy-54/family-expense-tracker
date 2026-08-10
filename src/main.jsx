import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/organic.css';
import './styles/app.css';
import './styles/login.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Production only — a service worker intercepting fetches during `npm run
// dev` would fight Vite's own HMR. See scripts/generate-sw.mjs for what it
// actually does (precache the build, serve it offline, keep itself updated).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      /* offline support degrades gracefully — the app still works online */
    });
  });
}
