<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import type { Task } from '../types';

// Для v-model
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(['update:modelValue', 'create-task']);

// Локальное состояние для управления видимостью
const dialog = ref(props.modelValue);
watch(() => props.modelValue, (val) => { dialog.value = val; });
watch(dialog, (val) => { if (!val) emit('update:modelValue', false); });

// Данные формы
const form = ref<any>(null); // Ссылка на VForm для валидации
const newTask = reactive<Omit<Task, 'id' | 'status'>>({
  description: '',
  amount: null,
  currency: 'TON',
  wallet: '',
});

// Правила валидации
const rules = {
  required: (v: any) => !!v || 'Поле обязательно для заполнения',
  isNumber: (v: any) => !isNaN(parseFloat(v)) && isFinite(v) || 'Должно быть числом',
  isPositive: (v: any) => v > 0 || 'Сумма должна быть больше нуля',
  wallet: (v: string) => (v && v.length > 10) || 'Некорректный адрес кошелька',
};

const resetForm = () => {
    newTask.description = '';
    newTask.amount = null;
    newTask.wallet = '';
    form.value?.resetValidation();
}

const handleClose = () => {
  dialog.value = false;
  // Сбрасываем форму после закрытия
  setTimeout(resetForm, 300);
}

const submit = async () => {
  const { valid } = await form.value.validate();
  if (valid) {
    emit('create-task', { ...newTask });
    handleClose();
  }
};
</script>

<template>
  <v-dialog v-model="dialog" persistent max-width="500px" @update:model-value="handleClose">
    <v-card>
      <v-form ref="form" @submit.prevent="submit">
        <v-card-title class="pa-4">
          <span class="text-h5">Новая задача</span>
        </v-card-title>
        <v-card-text class="pa-4">
          <v-textarea
            v-model="newTask.description"
            label="Описание задачи"
            rows="3"
            auto-grow
            variant="outlined"
            :rules="[rules.required]"
          ></v-textarea>
          <v-text-field
            v-model="newTask.amount"
            label="Сумма"
            type="number"
            suffix="TON"
            variant="outlined"
            class="mt-4"
            :rules="[rules.required, rules.isNumber, rules.isPositive]"
          ></v-text-field>
          <v-text-field
            v-model="newTask.wallet"
            label="Кошелек исполнителя"
            placeholder="EQ..."
            variant="outlined"
            class="mt-4"
            :rules="[rules.required, rules.wallet]"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="handleClose">Отмена</v-btn>
          <v-btn color="primary" variant="flat" type="submit">Создать</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>