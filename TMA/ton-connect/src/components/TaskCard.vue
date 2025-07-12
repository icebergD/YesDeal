<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { Task, TaskStatus } from '../types';
import { useTonWallet } from '@townsquarelabs/ui-vue';
import { toUserFriendlyAddress } from '@tonconnect/sdk';


const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update-status', payload: { id: number; newStatus: TaskStatus }): void;
}>();

const wallet = useTonWallet();

// Определяем роль пользователя на основе подключенного кошелька
const userFriendlyAddress = computed(() => {
  return wallet.value ? toUserFriendlyAddress(wallet.value.account.address) : null;
});
const isCustomer = computed(() => userFriendlyAddress.value === props.task.customerWallet);
const isPerformer = computed(() => userFriendlyAddress.value === props.task.performerWallet);

const statusInfo = computed(() => {
  switch (props.task.status) {
    case 'in_progress': return { text: 'В работе', color: 'blue' };
    case 'pending_confirmation': return { text: 'Ожидает подтверждения', color: 'orange' };
    case 'completed': return { text: 'Выполнена', color: 'green' };
    case 'cancelled': return { text: 'Отменена', color: 'grey' };
    default: return { text: 'Новая', color: 'primary' };
  }
});

const shortAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const performerDone = () => emit('update-status', { id: props.task.id, newStatus: 'pending_confirmation' });
const customerConfirm = () => emit('update-status', { id: props.task.id, newStatus: 'completed' });
const cancelTask = () => emit('update-status', { id: props.task.id, newStatus: 'cancelled' });
</script>

<template>
  <v-card variant="tonal">
    <v-card-text>
      <div class="d-flex align-start">
        <div class="flex-grow-1">
          <p class="text-body-1">{{ task.description }}</p>
          <div class="mt-3 d-flex flex-wrap" style="gap: 8px;">
             <v-chip size="small" variant="flat" :color="isCustomer ? 'primary' : ''">
                <v-icon start icon="mdi-account-arrow-left-outline"></v-icon>
                Заказчик: {{ shortAddress(task.customerWallet) }}
             </v-chip>
             <v-chip size="small" variant="flat" :color="isPerformer ? 'primary' : ''">
                <v-icon start icon="mdi-account-arrow-right-outline"></v-icon>
                Исполнитель: {{ shortAddress(task.performerWallet) }}
             </v-chip>
          </div>
        </div>
        <div class="ml-4 text-right">
          <div class="text-h6 font-weight-bold text-primary">{{ task.amount }}</div>
          <div class="text-caption text-grey">{{ task.currency }}</div>
        </div>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-3">
      <v-chip :color="statusInfo.color" variant="flat" size="small">{{ statusInfo.text }}</v-chip>
      <v-spacer></v-spacer>
      <template v-if="task.status === 'in_progress'">
        <v-btn v-if="isPerformer" @click="performerDone" size="small" variant="tonal">Исполнил</v-btn>
        <v-btn v-if="isCustomer" @click="cancelTask" size="small" variant="text" color="error">Отменить</v-btn>
      </template>
      <template v-if="task.status === 'pending_confirmation'">
        <v-btn v-if="isCustomer" @click="customerConfirm" size="small" color="success">Подтвердить</v-btn>
        <v-btn v-if="isPerformer || isCustomer" @click="cancelTask" size="small" variant="text" color="error">Отклонить</v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>