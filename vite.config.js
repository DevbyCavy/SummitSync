import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, /api/* is proxied to the PHP endpoints. Default: XAMPP Apache serving this folder.
// Override with API_PROXY_TARGET, e.g. `php -S 127.0.0.1:8099` from the project root → http://127.0.0.1:8099
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.API_PROXY_TARGET || 'http://localhost/showcase-it/summitsync';
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': { target, changeOrigin: true, rewrite: (path) => new URL(target).pathname.replace(/\/$/, '') + path },
      },
    },
  };
});
