import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/araak-logistics-website/', // هذا السطر المضاف ليخبر جيتهاب بالمسار الفرعي للمشروع
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});