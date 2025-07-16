// src/types.ts

export type VoteType = 'confirm' | 'cancel' | null;

export type TaskStatus = 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: number;
  description: string;
  amount: number | null;
  currency: 'TON';
  performerWallet: string;
  customerWallet: string;
  customerVote: VoteType;
  performerVote: VoteType;
  status: TaskStatus;
}