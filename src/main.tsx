import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { initializeFormulas } from './formulas/index';

// Initialize formula registry at app startup
// Per milestone 11: Formula registry initialization
initializeFormulas();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
