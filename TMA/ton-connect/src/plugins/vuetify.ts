// src/plugins/vuetify.ts

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Получаем тему из Telegram
// В браузере window.Telegram.WebApp будет undefined, поэтому делаем проверку
const tg = window.Telegram?.WebApp;

const tmaTheme = {
  dark: tg?.colorScheme === 'dark',
  colors: {
    background: tg?.themeParams?.bg_color || '#ffffff', // Основной фон
    surface: tg?.themeParams?.secondary_bg_color || '#f1f1f1', // Фон карточек, диалогов
    primary: tg?.themeParams?.button_color || '#2196F3', // Основной цвет кнопок
    // --- ВОТ ИСПРАВЛЕНИЕ ---
    'on-primary': tg?.themeParams?.button_text_color || '#ffffff', // Текст на основных кнопках
    secondary: tg?.themeParams?.hint_color || '#BDBDBD', // Вторичный цвет
    'on-secondary': '#000000',
    error: '#B00020',
    'on-error': '#ffffff',
    info: '#2196F3',
    'on-info': '#ffffff',
    success: '#4CAF50',
    'on-success': '#ffffff',
    warning: '#FB8C00',
    'on-warning': '#ffffff',
    'on-background': tg?.themeParams?.text_color || '#000000', // Основной цвет текста
    'on-surface': tg?.themeParams?.text_color || '#000000', // Текст на карточках
  },
};

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'tmaTheme',
    themes: {
      tmaTheme,
    },
  },
})