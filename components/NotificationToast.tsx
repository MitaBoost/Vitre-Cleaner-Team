import React, { useEffect } from 'react';
import { Notification } from '../types';
import { Bell } from 'lucide-react';

interface NotificationToastProps {
  notification: Notification | null;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm z-50">
      <div className="bg-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-[slideDown_0.3s_ease-out]">
        <div className="p-2 bg-slate-700 rounded-full">
           <Bell size={20} className="text-yellow-400" />
        </div>
        <div>
            <p className="text-sm font-medium leading-tight">{notification.message}</p>
            <p className="text-[10px] text-slate-400 mt-1">Just now</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;