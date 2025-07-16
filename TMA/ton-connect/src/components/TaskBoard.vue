
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import TaskCard from './TaskCard.vue';
import CreateTaskDialog from './CreateTaskDialog.vue';
import type { Task } from '../types';
import { useTonWallet, useTonConnectUI } from '@townsquarelabs/ui-vue';
import Address, { toUserFriendlyAddress } from '@tonconnect/sdk';
import { mockContract } from '../services/mockContract';

const wallet = useTonWallet();
// --- ВОТ ИСПРАВЛЕНИЕ ---
// Убираем квадратные скобки. Хук теперь возвращает один объект.
const tonConnectUI = useTonConnectUI();

const tasks = ref<Task[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const snackbar = ref<{ show: boolean, text: string, color: string }>({ show: false, text: '', color: '' });
const isDialogVisible = ref(false);

const showSnackbar = (text: string, color: string = 'error') => {
  snackbar.value = { show: true, text, color };
};

const fetchTasks = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    tasks.value = await mockContract.getTasks();
  } catch (e: any) {
    error.value = e.message || 'Не удалось загрузить задачи.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchTasks);

const handleCreateTask = async (newTaskData: Omit<Task, 'id' | 'status' | 'customerWallet' | 'customerVote' | 'performerVote'>) => {
  if (!wallet.value) {
    // Теперь мы можем безопасно вызывать метод .openModal()
    tonConnectUI.openModal();
    return;
  }

  isLoading.value = true;
  try {
    await mockContract.createTask({
      ...newTaskData,
      customerWallet: toUserFriendlyAddress(wallet.value.account.address),
    });
    await fetchTasks();
    showSnackbar('Задача успешно создана', 'success');
  } catch (e: any) {
    showSnackbar(e.message || 'Ошибка при создании задачи.');
  } finally {
    isLoading.value = false;
  }
};

const handleTaskAction = async (payload: { taskId: number, vote: 'confirm' | 'cancel' }) => {
  if (!wallet.value) {
    tonConnectUI.openModal();
    return;
  }

  isLoading.value = true;
  const userAddress = toUserFriendlyAddress(wallet.value.account.address);

  try {
    await mockContract.castVote(payload.taskId, userAddress, payload.vote);
    await fetchTasks();
    showSnackbar('Ваш голос учтен!', 'success');
  } catch (e: any) {
    showSnackbar(e.message || 'Произошла ошибка.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <v-container>
    <div v-if="isLoading && !tasks.length" class="text-center pa-10">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-4 text-grey">Загрузка данных...</p>
    </div>
    
    <v-alert v-if="error" type="error" variant="tonal" closable @update:model-value="error = null" class="mb-4">
      {{ error }}
    </v-alert>

    <v-slide-y-transition group tag="div" class="task-list">
      <task-card
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @task-action="handleTaskAction"
        class="mb-4"
      />
    </v-slide-y-transition>

    <p v-if="!isLoading && !tasks.length && !error" class="text-center text-grey-darken-1 mt-10">
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
    :loading="isLoading && tasks.length > 0"
  ></v-fab>

  <create-task-dialog
    v-model="isDialogVisible"
    @create-task="handleCreateTask"
  />
  
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
    location="top"
  >
    {{ snackbar.text }}
  </v-snackbar>
</template>