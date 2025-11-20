import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import RoomCard from './components/RoomCard';
import Stats from './components/Stats';
import AdminPanel from './components/AdminPanel';
import NotificationToast from './components/NotificationToast';
import { User, Room, Notification, Priority } from './types';
import { getRooms, saveRooms, getNotifications, saveNotifications, clearDailyData } from './services/storageService';
import { LayoutGrid, ListTodo, Settings, LogOut, BarChart3 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'stats' | 'admin'>('list');
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  // Initial Load
  useEffect(() => {
    const loadedRooms = getRooms();
    setRooms(loadedRooms);
    // Check for persisted session? For simplicity, we require login on refresh or use local state.
    // We'll stick to requiring login to ensure correct user attribution on reload for this demo.
  }, []);

  // Room Status Update Logic
  const updateRoomStatus = (roomId: string, newStatus: Room['status']) => {
    if (!user) return;

    const now = Date.now();
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        const updatedRoom: Room = {
          ...room,
          status: newStatus,
          lastUpdatedBy: user.username,
          lastUpdatedAt: now,
        };

        if (newStatus === 'In Progress') {
            updatedRoom.assignedTo = user.username;
            updatedRoom.startedAt = now;
        }
        
        if (newStatus === 'Done') {
            updatedRoom.completedAt = now;
        }

        return updatedRoom;
      }
      return room;
    });

    setRooms(updatedRooms);
    saveRooms(updatedRooms);

    // Create Notification
    const targetRoom = updatedRooms.find(r => r.id === roomId);
    if (targetRoom) {
        const notif: Notification = {
            id: Date.now().toString(),
            message: `${user.username} marked Room ${targetRoom.number} as ${newStatus}`,
            timestamp: now,
            type: 'info'
        };
        setCurrentNotification(notif);
        const existingNotifs = getNotifications();
        saveNotifications([notif, ...existingNotifs]);
    }
  };

  // Admin Functions
  const addRoom = (number: string, priority: Priority) => {
    const newRoom: Room = {
      id: Date.now().toString(),
      number,
      priority,
      status: 'Not Cleaned',
      lastUpdatedBy: null,
      lastUpdatedAt: null,
      startedAt: null,
      completedAt: null,
      assignedTo: null
    };
    const updated = [...rooms, newRoom];
    setRooms(updated);
    saveRooms(updated);
  };

  const deleteRoom = (id: string) => {
    const updated = rooms.filter(r => r.id !== id);
    setRooms(updated);
    saveRooms(updated);
  };

  const resetDay = () => {
    clearDailyData();
    setRooms(getRooms()); // Reload from storage after clear
    setActiveTab('list');
    setCurrentNotification({
        id: Date.now().toString(),
        message: "Daily schedule has been reset.",
        timestamp: Date.now(),
        type: 'warning'
    });
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('list');
  };

  // Render Logic
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Filter rooms for Dashboard
  // Sort: Urgent > VIP > Normal, then by Number
  const sortedRooms = [...rooms].sort((a, b) => {
     const priorityOrder = { Urgent: 3, VIP: 2, Normal: 1 };
     if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
         return priorityOrder[b.priority] - priorityOrder[a.priority];
     }
     return a.number.localeCompare(b.number);
  });

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      <NotificationToast notification={currentNotification} onClose={() => setCurrentNotification(null)} />
      
      {/* Top Navigation / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-sm flex justify-between items-center">
         <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${user.color}`}>
                {user.username.charAt(0)}
            </div>
            <div>
                <h1 className="text-lg font-bold leading-none">Vitre Manager</h1>
                <span className="text-xs text-slate-500">Welcome, {user.username}</span>
            </div>
         </div>
         <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-slate-600">
            <LogOut size={20} />
         </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-3xl mx-auto w-full">
        
        {activeTab === 'list' && (
          <div className="space-y-4 pb-20">
            <div className="flex justify-between items-end mb-2">
                <h2 className="text-xl font-bold text-slate-800">Today's Tasks</h2>
                <span className="text-sm font-medium text-slate-500">{rooms.filter(r => r.status === 'Done').length} / {rooms.length} Done</span>
            </div>
            
            {sortedRooms.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                    <p>No rooms scheduled for today.</p>
                    {user.role === 'admin' && <p className="text-sm mt-2">Go to Admin tab to add rooms.</p>}
                </div>
            ) : (
                sortedRooms.map(room => (
                <RoomCard 
                    key={room.id} 
                    room={room} 
                    currentUser={user} 
                    onUpdateStatus={updateRoomStatus} 
                />
                ))
            )}
          </div>
        )}

        {activeTab === 'stats' && (
            <Stats rooms={rooms} />
        )}

        {activeTab === 'admin' && (
            user.username === 'Admin' ? (
                <AdminPanel 
                    rooms={rooms} 
                    onAddRoom={addRoom} 
                    onDeleteRoom={deleteRoom} 
                    onResetDay={resetDay} 
                />
            ) : (
                <div className="text-center py-20">
                    <p className="text-red-500 font-bold">Access Denied</p>
                    <p className="text-slate-500">This area is restricted to the main Admin account only.</p>
                </div>
            )
        )}

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t border-slate-200 fixed bottom-0 w-full z-50 pb-safe">
        <div className="max-w-3xl mx-auto grid grid-cols-3 h-16">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'list' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ListTodo size={24} />
            <span className="text-[10px] font-bold uppercase">Rooms</span>
          </button>

          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'stats' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BarChart3 size={24} />
            <span className="text-[10px] font-bold uppercase">Stats</span>
          </button>

          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'admin' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Settings size={24} />
            <span className="text-[10px] font-bold uppercase">Admin</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;