<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { Task, TaskStatus } from '../types';

const props = defineProps({
  task: {
    type: Object as PropType<Task>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'update-status', payload: { id: number; newStatus: TaskStatus }): void;
}>();

// Вычисляемое свойство для отображения статуса (текст и цвет)
const statusInfo = computed(() => {
  switch (props.task.status) {
    case 'in_progress':
      return { text: 'В работе', color: 'blue' };
    case 'pending_confirmation':
      return { text: 'Ожидает подтверждения', color: 'orange' };
    case 'completed':
      return { text: 'Выполнена', color: 'green' };
    case 'cancelled':
      return { text: 'Отменена', color: 'grey' };
    default:
      return { text: 'Новая', color: 'primary' };
  }
});

// Моделируем логику кнопок
// В реальном приложении роли (заказчик/исполнитель) будут приходить извне
const isCustomer = true; // Пока считаем, что мы всегда заказчик
const isPerformer = true; // И одновременно исполнитель для демонстрации всех кнопок

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
          <v-chip size="small" variant="flat" class="mt-3">
            <v-icon start icon="mdi-wallet-outline"></v-icon>
            {{ task.wallet.slice(0, 6) }}...{{ task.wallet.slice(-4) }}
          </v-chip>
        </div>
        <div class="ml-4 text-right">
          <div class="text-h6 font-weight-bold text-primary">
            {{ task.amount }}
          </div>
          <div class="text-caption text-grey">{{ task.currency }}</div>
        </div>
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="pa-3">
      <v-chip :color="statusInfo.color" variant="flat" size="small">
        {{ statusInfo.text }}
      </v-chip>
      <v-spacer></v-spacer>

      <!-- Логика отображения кнопок -->
      <template v-if="task.status === 'in_progress'">
        <v-btn v-if="isPerformer" @click="performerDone" size="small" variant="tonal">Исполнил</v-btn>
        <v-btn v-if="isCustomer" @click="cancelTask" size="small" variant="text" color="error">Отменить</v-btn>
      </template>

      <template v-if="task.status === 'pending_confirmation'">
        <v-btn v-if="isCustomer" @click="customerConfirm" size="small" color="success">Подтвердить</v-btn>
        <v-btn v-if="isPerformer" @click="cancelTask" size="small" variant="text" color="error">Не выполнено</v-btn>
      </template>
    </v-card-actions>
  </v-card>
</template>