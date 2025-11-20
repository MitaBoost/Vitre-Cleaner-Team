export type UserRole = 'admin' | 'cleaner';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  color: string;
}

export type RoomStatus = 'Not Cleaned' | 'In Progress' | 'Done';
export type Priority = 'Normal' | 'VIP' | 'Urgent';

export interface Room {
  id: string;
  number: string;
  priority: Priority;
  status: RoomStatus;
  lastUpdatedBy: string | null; // Username
  lastUpdatedAt: number | null; // Timestamp
  startedAt: number | null;
  completedAt: number | null;
  assignedTo: string | null; // Username of who started/completed it
  notes?: string;
}

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  type: 'info' | 'success' | 'warning';
}

export interface DailyStats {
  totalRooms: number;
  cleanedRooms: number;
  inProgressRooms: number;
  userPerformance: Record<string, { count: number; minutesWorked: number }>;
}