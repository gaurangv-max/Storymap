import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep a single vendor bundle. Manually splitting React/MUI into separate
    // chunks broke React's module init order in production (react-dom evaluating
    // before react → blank screen). The bundle is small enough (~160 kB gzipped)
    // that one chunk is fine; just raise the size-warning threshold above it.
    chunkSizeWarningLimit: 1000,
  },
});
