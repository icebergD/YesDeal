import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { TonConnectUIPlugin } from '@townsquarelabs/ui-vue'
// import 'vuetify/styles'
// import { createVuetify } from 'vuetify'
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'
import vuetify from './plugins/vuetify' // Импортируем наш плагин
import { createPinia } from 'pinia'

// const vuetify = createVuetify({
//   components,
//   directives,
// })


// Необходимо для работы Telegram Mini Apps
// В реальном приложении этот скрипт должен быть подключен в index.html
// Для разработки в браузере мы можем создать моковый объект
if (!window.Telegram) {
  console.log('Telegram script not found. Using mock data for development.');
  window.Telegram = {
    WebApp: {
      colorScheme: 'light', // 'light' or 'dark'
      themeParams: {
        // Примерные цвета светлой темы Telegram
        bg_color: '#ffffff',
        secondary_bg_color: '#f4f4f5',
        text_color: '#000000',
        hint_color: '#9e9e9e',
        link_color: '#2979ff',
        button_color: '#2979ff',
        button_text_color: '#ffffff',
      },
      // Просто чтобы приложение не ломалось
      ready: () => {},
      expand: () => {},
    }
  };
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(vuetify)
app.use(TonConnectUIPlugin, {
  manifestUrl: import.meta.env['VITE_APP_MANIFEST_URL']
})
app.mount('#app')


