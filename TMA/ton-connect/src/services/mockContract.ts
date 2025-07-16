// src/services/mockContract.ts

import type { Task, VoteType } from '../types';
import  Address  from '@tonconnect/sdk';

// Функция для безопасного сравнения адресов
const areAddressesEqual = (address1: string, address2:string) => Address.parse(address1).equals(Address.parse(address2));

// Имитация базы данных на смарт-контракте
let tasks: Task[] = [
  {
    id: 1,
    description: 'Сделать редизайн главной страницы. Нужен современный минималистичный стиль.',
    amount: 150.5,
    currency: 'TON',
    performerWallet: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECg',
    customerWallet: 'UQB5D...V1wE',
    status: 'in_progress',
    customerVote: null,
    performerVote: null,
  },
  {
    id: 2,
    description: 'Написать парсер для сайта новостей',
    amount: 75,
    currency: 'TON',
    performerWallet: 'UQB5D...V1wE',
    customerWallet: 'UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAECg',
    status: 'in_progress',
    customerVote: 'confirm', // Пример, где заказчик уже проголосовал
    performerVote: null,
  },
];

const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

class MockTaskContract {

  // Приватный метод для разрешения исхода задачи после голосования
  private _resolveTask(task: Task) {
    if (task.customerVote === 'confirm' && task.performerVote === 'confirm') {
      task.status = 'completed';
      console.log(`Task ${task.id}: COMPLETED. Money sent to performer.`);
    } else if (task.customerVote === 'cancel' && task.performerVote === 'cancel') {
      task.status = 'cancelled';
      console.log(`Task ${task.id}: CANCELLED. Money returned to customer.`);
    }
  }

  async getTasks(): Promise<Task[]> {
    await networkDelay(500);
    return JSON.parse(JSON.stringify(tasks));
  }

  async createTask(data: Omit<Task, 'id' | 'status' | 'customerVote' | 'performerVote'>): Promise<Task> {
    await networkDelay(1500);
    const newTask: Task = {
      ...data,
      id: Date.now(),
      status: 'in_progress',
      customerVote: null,
      performerVote: null,
    };
    tasks.unshift(newTask);
    return { ...newTask };
  }

  // Единый метод для голосования
  async castVote(taskId: number, callerWallet: string, vote: 'confirm' | 'cancel'): Promise<void> {
    await networkDelay(1200);
    const task = tasks.find(t => t.id === taskId);

    if (!task) throw new Error("Задача не найдена!");
    if (task.status !== 'in_progress') throw new Error("Голосование по этой задаче уже завершено.");

    // Определяем, кто голосует, и обновляем его голос
    if (areAddressesEqual(callerWallet, task.customerWallet)) {
      task.customerVote = vote;
    } else if (areAddressesEqual(callerWallet, task.performerWallet)) {
      task.performerVote = vote;
    } else {
      throw new Error("У вас нет прав для голосования по этой задаче.");
    }

    // Проверяем, не завершилась ли задача
    this._resolveTask(task);
  }
}

export const mockContract = new MockTaskContract();