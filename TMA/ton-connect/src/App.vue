<script setup lang="ts">
import { onMounted } from 'vue';
import TaskBoard from './components/TaskBoard.vue';
import ConnectWalletButton from './components/ConnectWalletButton.vue';
import { TonConnectUIProvider as TonConnectUIPlugin } from '@townsquarelabs/ui-vue';


onMounted(() => {
  // Сообщаем Telegram, что приложение готово, и его можно отрисовывать
  window.Telegram?.WebApp.ready();
  window.Telegram?.WebApp.expand();
});

const manifestUrl = new URL('/tonconnect-manifest.json', window.location.href).toString();
</script>


<template>
  <!-- Оборачиваем все приложение в провайдер -->
  <TonConnectUIProvider :manifest-url="manifestUrl">
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
  </TonConnectUIProvider>
</template>


<style>
html {
  overflow-y: auto !important;
}

.v-toolbar-title {
  flex: 0 1 auto;
}
</style>