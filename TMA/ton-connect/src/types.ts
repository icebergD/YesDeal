export type TaskStatus = 'in_progress' | 'pending_confirmation' | 'completed' | 'cancelled';

export interface Task {
  id: number;
  description: string;
  amount: number | null;
  currency: 'TON';
  performerWallet: string;
  customerWallet: string;
  status: TaskStatus;
}