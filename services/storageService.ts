import { Room, Notification } from '../types';

const ROOMS_KEY = 'vitre_rooms_v1';
const NOTIFS_KEY = 'vitre_notifs_v1';

export const getRooms = (): Room[] => {
  try {
    const data = localStorage.getItem(ROOMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load rooms", e);
    return [];
  }
};

export const saveRooms = (rooms: Room[]) => {
  try {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  } catch (e) {
    console.error("Failed to save rooms", e);
  }
};

export const getNotifications = (): Notification[] => {
  try {
    const data = localStorage.getItem(NOTIFS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveNotifications = (notifs: Notification[]) => {
  try {
    // Keep only last 20 notifications
    const trimmed = notifs.slice(0, 20);
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error("Failed to save notifications", e);
  }
};

export const clearDailyData = () => {
  // Reset status but keep rooms? Or clear everything?
  // Based on request "Reset all rooms for a new day", we will keep the room list but reset status.
  const rooms = getRooms();
  const resetRooms = rooms.map(r => ({
    ...r,
    status: 'Not Cleaned' as const,
    lastUpdatedBy: null,
    lastUpdatedAt: null,
    startedAt: null,
    completedAt: null,
    assignedTo: null,
    notes: ''
  }));
  saveRooms(resetRooms);
};