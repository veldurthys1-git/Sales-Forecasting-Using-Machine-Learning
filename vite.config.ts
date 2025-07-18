import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Sales-Forecasting-Using-Machine-Learning/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
