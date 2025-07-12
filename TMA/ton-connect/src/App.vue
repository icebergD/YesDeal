<script setup lang="ts">
import { onMounted } from 'vue';
import TaskBoard from './components/TaskBoard.vue';
import ConnectWalletButton from './components/ConnectWalletButton.vue';



onMounted(() => {
  // Сообщаем Telegram, что приложение готово, и его можно отрисовывать
  window.Telegram?.WebApp.ready();
  window.Telegram?.WebApp.expand();
});

</script>


<template>

    <v-app>
      <!-- Шапка приложения -->
      <v-app-bar app color="background" flat class="px-2">
        <v-toolbar-title class="font-weight-bold">
          TMA Freelance
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <connect-wallet-button />
      </v-app-bar>

      <v-main>
        <task-board />
      </v-main>
    </v-app>
</template>


<style>
/* Убираем лишние скроллбары */
html {
  overflow-y: auto !important;
}
/* Стили для кнопки TON Connect, чтобы она лучше вписывалась */
:root {
  --t-connect-button-border-radius: 8px;
  --t-connect-button-font-size: 14px;
  --t-connect-button-padding: 8px 14px;
}
</style>