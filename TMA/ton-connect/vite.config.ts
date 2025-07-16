import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Настраиваем алиас "@"
      '@': path.resolve(__dirname, './src'),
      // Пример другого алиаса, если вам нужен:
      // '@/assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    allowedHosts: [
      'prime-firmly-lark.ngrok-free.app',
      '*',
      'f436d047f57cdc.lhr.life',
      '0ab4a41a0fcdbd.lhr.life'
    ]
  }
})
