import { User } from './types';

export const USERS: User[] = [
  { id: '0', username: 'Admin', role: 'admin', color: 'bg-slate-800' },
  { id: '1', username: 'Ali', role: 'cleaner', color: 'bg-blue-500' },
  { id: '2', username: 'Ayoub', role: 'cleaner', color: 'bg-green-500' },
  { id: '3', username: 'Youness', role: 'cleaner', color: 'bg-purple-500' },
];

export const PRIORITY_COLORS = {
  Normal: 'bg-gray-100 text-gray-600 border-gray-200',
  VIP: 'bg-purple-100 text-purple-700 border-purple-200',
  Urgent: 'bg-red-100 text-red-700 border-red-200',
};

export const STATUS_COLORS = {
  'Not Cleaned': 'bg-red-500',
  'In Progress': 'bg-orange-400',
  'Done': 'bg-green-500',
};

export const APP_NAME = "Vitre Manager";