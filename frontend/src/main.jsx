import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// 🔴 Replace this with your actual Client ID from Google Cloud Console
const clientId = '473065953906-21s2ib6lk6mndoeq5for0cj76gkjbfq1.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
