// src/services/mockContract.ts

import type { Task, TaskStatus } from '../types';

// Имитация базы данных или хранилища на смарт-контракте
let tasks: Task[] = [
  {
    id: 1,
    description: 'Сделать редизайн главной страницы сайта. Использовать светлые тона и современный минималистичный стиль.',
    amount: 150.5,
    currency: 'TON',
    performerWallet: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECg',
    customerWallet: 'UQB5D...V1wE',
    status: 'in_progress',
  },
  {
    id: 2,
    description: 'Написать парсер для сайта новостей',
    amount: 75,
    currency: 'TON',
    performerWallet: 'UQB5D...V1wE',
    customerWallet: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECg',
    status: 'pending_confirmation',
  }
];

// Имитируем задержку сети
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

class MockTaskContract {
  // Получить все задачи (публичный get-метод контракта)
  async getTasks(): Promise<Task[]> {
    await networkDelay(500);
    // Возвращаем копию, чтобы избежать прямых мутаций состояния
    return JSON.parse(JSON.stringify(tasks));
  }

  // Создать задачу (транзакция)
  async createTask(data: Omit<Task, 'id' | 'status'>): Promise<Task> {
    await networkDelay(1500);
    const newTask: Task = {
      ...data,
      id: Date.now(),
      status: 'in_progress'
    };
    tasks.unshift(newTask);
    return { ...newTask };
  }

  // Исполнитель нажал "Исполнил" (транзакция)
  async performerDeclaresDone(taskId: number, performerWallet: string): Promise<void> {
    await networkDelay(1200);
    const task = tasks.find(t => t.id === taskId);
    if (!task) throw new Error("Задача не найдена!");
    if (task.performerWallet !== performerWallet) throw new Error("Только исполнитель может выполнить это действие!");
    if (task.status !== 'in_progress') throw new Error("Неверный статус задачи!");
    
    task.status = 'pending_confirmation';
  }

  // Заказчик нажал "Подтвердить" (транзакция)
  async customerConfirms(taskId: number, customerWallet: string): Promise<void> {
    await networkDelay(1200);
    const task = tasks.find(t => t.id === taskId);
    if (!task) throw new Error("Задача не найдена!");
    if (task.customerWallet !== customerWallet) throw new Error("Только заказчик может выполнить это действие!");
    if (task.status !== 'pending_confirmation') throw new Error("Неверный статус задачи!");

    task.status = 'completed';
    // Здесь в реальном контракте произошла бы выплата
  }
  
  // Отмена задачи (транзакция)
  async cancelTask(taskId: number, callerWallet: string): Promise<void> {
    await networkDelay(1200);
    const task = tasks.find(t => t.id === taskId);
    if (!task) throw new Error("Задача не найдена!");
    // Отменить может либо заказчик, либо исполнитель, в зависимости от статуса
    if (task.customerWallet !== callerWallet && task.performerWallet !== callerWallet) {
      throw new Error("У вас нет прав на отмену этой задачи!");
    }
    if (task.status === 'completed') throw new Error("Нельзя отменить выполненную задачу!");

    task.status = 'cancelled';
    // Здесь в реальном контракте деньги бы вернулись заказчику
  }
}

// Экспортируем один экземпляр класса (синглтон), чтобы все приложение
// работало с одним и тем же "контрактом"
export const mockContract = new MockTaskContract();