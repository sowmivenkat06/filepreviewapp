import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '473065953906-21s2ib6lk6mndoeq5for0cj76gkjbfq1.apps.googleusercontent.com'; // ✅ Set this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

