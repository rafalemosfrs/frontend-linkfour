import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { ProfileProvider } from './context/ProfileContext';
import { LinksProvider } from './context/LinksContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />
      <LinksProvider>
        <ProfileProvider>
          <App />
        </ProfileProvider>
      </LinksProvider>
    </BrowserRouter>
  </StrictMode>
);
