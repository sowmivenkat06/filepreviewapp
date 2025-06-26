// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: 4173, // optional
    allowedHosts: ['filepreviewapp-1.onrender.com'] 
  }
});
