import React, { useState } from 'react';
import { Room, Priority } from '../types';
import { Plus, Trash2, RefreshCcw, List } from 'lucide-react';

interface AdminPanelProps {
  rooms: Room[];
  onAddRoom: (roomNumber: string, priority: Priority) => void;
  onDeleteRoom: (id: string) => void;
  onResetDay: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ rooms, onAddRoom, onDeleteRoom, onResetDay }) => {
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Normal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomNumber.trim()) {
      onAddRoom(newRoomNumber.trim(), newPriority);
      setNewRoomNumber('');
      setNewPriority('Normal');
    }
  };

  const handleReset = () => {
      if(confirm("Are you sure? This will reset all statuses to 'Not Cleaned' for the new day. History will be cleared.")) {
          onResetDay();
      }
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" /> 
            Add New Room
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Room Number</label>
            <input
              type="text"
              value={newRoomNumber}
              onChange={(e) => setNewRoomNumber(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 104"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Normal', 'VIP', 'Urgent'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setNewPriority(p)}
                  className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                    newPriority === p
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!newRoomNumber}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50 transition-all"
          >
            Add Room
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <List className="w-5 h-5 mr-2 text-slate-600" />
            Manage Rooms
        </h3>
        <div className="max-h-64 overflow-y-auto space-y-2 no-scrollbar">
            {rooms.length === 0 && <p className="text-center text-slate-400 text-sm">No rooms added yet.</p>}
            {rooms.map(room => (
                <div key={room.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <div>
                        <span className="font-bold text-slate-700">Room {room.number}</span>
                        <span className="text-xs ml-2 text-slate-500">({room.priority})</span>
                    </div>
                    <button 
                        onClick={() => onDeleteRoom(room.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full py-4 border-2 border-red-100 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center"
      >
        <RefreshCcw size={20} className="mr-2" />
        Reset Day (Admin Only)
      </button>
    </div>
  );
};

export default AdminPanel;