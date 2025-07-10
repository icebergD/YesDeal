<script setup lang="ts">
import { TonConnectButton, useTonConnectUI } from '@townsquarelabs/ui-vue';
// `toUserFriendlyAddress` нам здесь больше не нужен,
// так как библиотека `@tonconnect/ui-vue` версии 2+ уже возвращает адрес в user-friendly формате.
// Это делает код еще чище.
import { useWalletStore } from '../stores/walletStore';

const walletStore = useWalletStore();

// --- ВОТ ИСПРАВЛЕНИЕ ---
// Деструктурируем объект, а не массив. И получаем сам инстанс tonConnectUI.
const { tonConnectUI } = useTonConnectUI();

// Подписываемся на изменение статуса кошелька
// Эта функция будет вызываться каждый раз, когда пользователь подключает или отключает кошелек
tonConnectUI.onStatusChange(walletInfo => {
  if (walletInfo) {
    // В walletInfo.account.address уже находится user-friendly адрес
    walletStore.setWallet({
      ...walletInfo,
      account: { ...walletInfo.account, address: walletInfo.account.address }
    });
  } else {
    // Если кошелек отключен, очищаем хранилище
    walletStore.setWallet(null);
  }
});
</script>

<template>
  <!-- Это готовый компонент кнопки от TON Connect. Он сам управляет своим видом и модальным окном. -->
  <TonConnectButton />
</template>