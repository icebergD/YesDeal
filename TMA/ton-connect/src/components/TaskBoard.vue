<script setup lang="ts">
import { ref } from 'vue';
import TaskCard from './TaskCard.vue';
import CreateTaskDialog from './CreateTaskDialog.vue';
import type { Task, TaskStatus } from '../types';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-vue';
import { toUserFriendlyAddress } from '@tonconnect/sdk';

// Получаем данные кошелька и UI
const wallet = useTonWallet();
const [tonConnectUI] = useTonConnectUI();

const isDialogVisible = ref(false);

// Моковые данные
const tasks = ref<Task[]>([
  {
    id: 1,
    description: 'Сделать редизайн главной страницы сайта. Использовать светлые тона и современный минималистичный стиль.',
    amount: 150.5,
    currency: 'TON',
    performerWallet: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
    customerWallet: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECg',
    status: 'in_progress',
  },
  {
    id: 2,
    description: 'Написать парсер для сайта новостей',
    amount: 75,
    currency: 'TON',
    performerWallet: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
    customerWallet: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECg',
    status: 'pending_confirmation',
  },
]);

// Функция для "создания" новой задачи
const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'status' | 'customerWallet'>) => {
  if (!wallet.value) {
    // Показываем модальное окно, если кошелек не подключен
    tonConnectUI.openModal();
    return;
  }

  const newTask: Task = {
    ...newTaskData,
    id: Date.now(),
    customerWallet: toUserFriendlyAddress(wallet.value.account.address), // Добавляем кошелек заказчика
    status: 'in_progress'
  };
  tasks.value.unshift(newTask);
};

// Функция для "обновления" статуса
const handleUpdateStatus = (payload: { id: number, newStatus: TaskStatus }) => {
  const task = tasks.value.find(t => t.id === payload.id);
  if (task) {
    task.status = payload.newStatus;
    console.log(`Task ${payload.id} status updated to ${payload.newStatus}`);
  }
};
</script>

<template>
  <v-container>
    <v-slide-y-transition group tag="div" class="task-list">
      <task-card
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @update-status="handleUpdateStatus"
        class="mb-4"
      />
    </v-slide-y-transition>

    <p v-if="!tasks.length" class="text-center text-grey-darken-1 mt-10">
      У вас пока нет задач. <br>Нажмите "+", чтобы создать первую.
    </p>
  </v-container>

  <v-fab
    icon="mdi-plus"
    location="bottom end"
    size="large"
    app
    appear
    class="mb-4 mr-4"
    @click="isDialogVisible = true"
  ></v-fab>

  <create-task-dialog
    v-model="isDialogVisible"
    @create-task="handleCreateTask"
  />
</template>