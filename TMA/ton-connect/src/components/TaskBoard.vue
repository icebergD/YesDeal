<script setup lang="ts">
import { ref } from 'vue';
import TaskCard from './TaskCard.vue';
import CreateTaskDialog from './CreateTaskDialog.vue';
import type { Task, TaskStatus } from '../types';

// Для управления видимостью диалога
const isDialogVisible = ref(false);

// Моковые данные (имитация данных со смарт-контракта)
const tasks = ref<Task[]>([
  {
    id: 1,
    description: 'Сделать редизайн главной страницы сайта. Использовать светлые тона и современный минималистичный стиль.',
    amount: 150.5,
    currency: 'TON',
    wallet: 'EQB...sdaf',
    status: 'in_progress',
  },
  {
    id: 2,
    description: 'Написать парсер для сайта новостей',
    amount: 75,
    currency: 'TON',
    wallet: 'EQA...asdf',
    status: 'pending_confirmation',
  },
  {
    id: 3,
    description: 'Развернуть бота в Docker',
    amount: 30,
    currency: 'TON',
    wallet: 'EQC...qwer',
    status: 'completed',
  },
  {
    id: 4,
    description: 'Настроить CI/CD для проекта на Gitlab',
    amount: 200,
    currency: 'TON',
    wallet: 'EQD...zxcv',
    status: 'cancelled',
  }
]);

// Функция для "создания" новой задачи
const handleCreateTask = (newTaskData: Omit<Task, 'id' | 'status'>) => {
  const newTask: Task = {
    ...newTaskData,
    id: Date.now(), // Уникальный ID на основе времени
    status: 'in_progress' // Новая задача сразу в работе
  };
  tasks.value.unshift(newTask); // Добавляем в начало списка
};

// Функция для "обновления" статуса
const handleUpdateStatus = (payload: { id: number, newStatus: TaskStatus }) => {
  const task = tasks.value.find(t => t.id === payload.id);
  if (task) {
    task.status = payload.newStatus;
    // Здесь в будущем будет вызов смарт-контракта
    console.log(`Task ${payload.id} status updated to ${payload.newStatus}`);
  }
};
</script>

<template>
  <v-container>
    <div class="d-flex align-center mb-4">
      <!-- <h1 class="text-h5 font-weight-bold">Мои Задачи</h1> -->
      <v-spacer></v-spacer>
      <!-- Можно добавить фильтры или сортировку -->
    </div>

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

  <!-- Плавающая кнопка для создания задачи -->
  <v-fab
    icon="mdi-plus"
    location="bottom end"
    size="large"
    app
    appear
    class="mb-4 mr-4"
    @click="isDialogVisible = true"
  ></v-fab>

  <!-- Диалог создания задачи -->
  <create-task-dialog
    v-model="isDialogVisible"
    @create-task="handleCreateTask"
  />
</template>