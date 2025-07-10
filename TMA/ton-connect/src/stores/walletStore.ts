import { defineStore } from 'pinia';
import { ref } from 'vue';

// Тип для информации о кошельке из TON Connect
interface WalletInfo {
  account: {
    address: string;
  };
  // ... другие поля, если они понадобятся
}

export const useWalletStore = defineStore('wallet', () => {
  // Состояние
  const isConnected = ref(false);
  const address = ref<string | null>(null);

  // Действия (Actions)
  function setWallet(walletInfo: WalletInfo | null) {
    if (walletInfo) {
      isConnected.value = true;
      address.value = walletInfo.account.address;
      console.log('Wallet connected:', address.value);
    } else {
      isConnected.value = false;
      address.value = null;
      console.log('Wallet disconnected.');
    }
  }

  return { isConnected, address, setWallet };
});