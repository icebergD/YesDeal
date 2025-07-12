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
      '01322f41ade096.lhr.life',
      '93cad13fd93e7c.lhr.life'
    ]
  }
})
