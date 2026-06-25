import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ mode }) => {
  // Load env files from the current directory, including system process.env variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/britishrail-v3/',
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_ADSENSE_CLIENT_ID': JSON.stringify(
        env.VITE_ADSENSE_CLIENT_ID || env.ADSENSE_CLIENT_ID || process.env.VITE_ADSENSE_CLIENT_ID || process.env.ADSENSE_CLIENT_ID || ''
      ),
      'import.meta.env.VITE_ADSENSE_SLOT_ID': JSON.stringify(
        env.VITE_ADSENSE_SLOT_ID || env.ADSENSE_SLOT_ID || env.VITE_ADSENSE_SLOT_1 || process.env.VITE_ADSENSE_SLOT_ID || process.env.ADSENSE_SLOT_ID || ''
      ),
      'import.meta.env.VITE_ADSENSE_SLOT_2': JSON.stringify(
        env.VITE_ADSENSE_SLOT_2 || process.env.VITE_ADSENSE_SLOT_2 || ''
      ),
      'import.meta.env.VITE_ADSENSE_SLOT_3': JSON.stringify(
        env.VITE_ADSENSE_SLOT_3 || process.env.VITE_ADSENSE_SLOT_3 || ''
      ),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
