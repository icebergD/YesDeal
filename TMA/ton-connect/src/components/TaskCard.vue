
<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import type { Task, VoteType } from '../types';
import { useTonWallet } from '@townsquarelabs/ui-vue';
import { toUserFriendlyAddress } from '@tonconnect/sdk';
import Address from '@tonconnect/sdk';

// --- PROPS & EMITS ---
const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'task-action', payload: { taskId: number, vote: 'confirm' | 'cancel' }): void;
}>();

// --- ДАННЫЕ ДЛЯ ДИАЛОГА ПОДТВЕРЖДЕНИЯ ---
const isConfirmDialogVisible = ref(false);
const actionToConfirm = ref<{ vote: 'confirm' | 'cancel', text: string } | null>(null);

// --- ДАННЫЕ ПОЛЬЗОВАТЕЛЯ И РОЛИ ---
const wallet = useTonWallet();
const userFriendlyAddress = computed(() => wallet.value ? toUserFriendlyAddress(wallet.value.account.address) : null);

const areAddressesEqual = (address1: string | null, address2: string | null): boolean => {
  if (!address1 || !address2) return false;
  try {
    return Address.parse(address1).equals(Address.parse(address2));
  } catch (e) {
    return false;
  }
}
const isCustomer = computed(() => areAddressesEqual(userFriendlyAddress.value, props.task.customerWallet));
const isPerformer = computed(() => areAddressesEqual(userFriendlyAddress.value, props.task.performerWallet));

// --- ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ UI ---
const shortAddress = (address: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

// Функция для открытия диалога подтверждения
const openConfirmation = (vote: 'confirm' | 'cancel') => {
  const text = vote === 'confirm'
    ? 'Вы подтверждаете выполнение задачи. Это решение нельзя будет отменить. Если вторая сторона тоже подтвердит выполнение, исполнитель получит средства.'
    : 'Вы хотите отменить задачу. Если вторая сторона тоже отменит ее, средства вернутся заказчику.';
  actionToConfirm.value = { vote, text };
  isConfirmDialogVisible.value = true;
};

// Функция, которая вызывается из диалога
const onConfirmAction = () => {
  if (actionToConfirm.value) {
    emit('task-action', { taskId: props.task.id, vote: actionToConfirm.value.vote });
  }
  isConfirmDialogVisible.value = false;
};

// Информация для отображения статуса и голосов
const voteInfo = (vote: VoteType) => {
  if (vote === 'confirm') return { text: 'Подтверждено', icon: 'mdi-check-circle', color: 'success' };
  if (vote === 'cancel') return { text: 'Отменено', icon: 'mdi-close-circle', color: 'error' };
  return { text: 'Ожидание', icon: 'mdi-timer-sand-empty', color: 'grey' };
};

const finalStatusInfo = computed(() => {
  switch (props.task.status) {
    case 'completed': return { text: 'Выполнена', color: 'green' };
    case 'cancelled': return { text: 'Отменена', color: 'grey' };
    default: return { text: 'В работе', color: 'blue' };
  }
});

</script>

<template>
  <v-card variant="tonal">
    <v-card-text>
      <div class="d-flex align-start">
        <div class="flex-grow-1">
          <p class="text-body-1">{{ task.description }}</p>
          <!-- ОТОБРАЖЕНИЕ ГОЛОСОВ -->
          <div class="mt-4">
            <p class="text-caption font-weight-medium mb-1">Статус голосования:</p>
            <div class="d-flex" style="gap: 16px;">
              <div class="d-flex align-center">
                <v-icon :color="voteInfo(task.customerVote).color" :icon="voteInfo(task.customerVote).icon" size="small" class="mr-1"></v-icon>
                <span class="text-body-2">Заказчик: {{ shortAddress(task.customerWallet) }}</span>
              </div>
              <div class="d-flex align-center">
                <v-icon :color="voteInfo(task.performerVote).color" :icon="voteInfo(task.performerVote).icon" size="small" class="mr-1"></v-icon>
                <span class="text-body-2">Исполнитель: {{ shortAddress(task.performerWallet) }}</span>
              </div>
            </div>
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
      <v-chip :color="finalStatusInfo.color" variant="flat" size="small">{{ finalStatusInfo.text }}</v-chip>
      <v-spacer></v-spacer>
      <!-- БЛОК КНОПОК УПРАВЛЕНИЯ -->
      <div v-if="task.status === 'in_progress'">
        <div v-if="isCustomer">
          <v-btn
            size="small"
            color="success"
            variant="tonal"
            class="mr-2"
            @click="openConfirmation('confirm')"
            :disabled="task.customerVote === 'confirm'"
          >Подтвердить</v-btn>
          <v-btn
            size="small"
            color="error"
            variant="text"
            @click="openConfirmation('cancel')"
            :disabled="task.customerVote === 'cancel'"
          >Отменить</v-btn>
        </div>
        <div v-if="isPerformer">
          <v-btn
            size="small"
            color="success"
            variant="tonal"
            class="mr-2"
            @click="openConfirmation('confirm')"
            :disabled="task.performerVote === 'confirm'"
          >Выполнено</v-btn>
          <v-btn
            size="small"
            color="error"
            variant="text"
            @click="openConfirmation('cancel')"
            :disabled="task.performerVote === 'cancel'"
          >Отменить</v-btn>
        </div>
      </div>
    </v-card-actions>
  </v-card>

  <!-- ДИАЛОГ ПОДТВЕРЖДЕНИЯ ДЕЙСТВИЯ -->
  <v-dialog v-model="isConfirmDialogVisible" max-width="400" persistent>
    <v-card
      v-if="actionToConfirm"
      :title="actionToConfirm.vote === 'confirm' ? 'Подтверждение задачи' : 'Отмена задачи'"
    >
      <v-card-text>
        {{ actionToConfirm.text }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="isConfirmDialogVisible = false">Назад</v-btn>
        <v-btn
          :color="actionToConfirm.vote === 'confirm' ? 'success' : 'error'"
          variant="flat"
          @click="onConfirmAction"
        >
          {{ actionToConfirm.vote === 'confirm' ? 'Да, подтверждаю' : 'Да, отменяю' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>