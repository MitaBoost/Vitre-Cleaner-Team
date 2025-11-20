import React, { useState } from 'react';
import { Room, User, Priority } from '../types';
import { PRIORITY_COLORS, STATUS_COLORS } from '../constants';
import { Clock, CheckCircle, Play, User as UserIcon, Upload } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  currentUser: User;
  onUpdateStatus: (roomId: string, newStatus: Room['status']) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, currentUser, onUpdateStatus }) => {
  const isDone = room.status === 'Done';
  const inProgress = room.status === 'In Progress';
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAction = (e: React.MouseEvent, action: 'start' | 'finish') => {
    e.stopPropagation();
    if (action === 'start') {
      onUpdateStatus(room.id, 'In Progress');
    } else {
      onUpdateStatus(room.id, 'Done');
    }
  };

  return (
    <div 
      onClick={() => setIsExpanded(!isExpanded)}
      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200 ${
        isExpanded ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-12 rounded-full ${STATUS_COLORS[room.status]}`}></div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Room {room.number}</h3>
            <div className="flex items-center space-x-2 mt-1">
               <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${PRIORITY_COLORS[room.priority]}`}>
                  {room.priority}
               </span>
               <span className="text-xs text-slate-400 font-medium">
                 {room.status}
               </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
           {room.assignedTo && (
             <div className="flex items-center justify-end space-x-1 text-slate-600 mb-1">
                <UserIcon size={12} />
                <span className="text-xs font-bold">{room.assignedTo}</span>
             </div>
           )}
           {room.lastUpdatedAt && (
             <div className="flex items-center justify-end space-x-1 text-slate-400">
                <Clock size={12} />
                <span className="text-[10px]">
                  {new Date(room.lastUpdatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
             </div>
           )}
        </div>
      </div>

      {/* Expanded Action Area */}
      {isExpanded && !isDone && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-1 gap-3 animate-fadeIn">
          {room.status === 'Not Cleaned' && (
            <button
              onClick={(e) => handleAction(e, 'start')}
              className="flex items-center justify-center w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-transform"
            >
              <Play size={20} className="mr-2" /> Start Cleaning
            </button>
          )}

          {room.status === 'In Progress' && (
            <button
              onClick={(e) => handleAction(e, 'finish')}
              className="flex items-center justify-center w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-transform"
            >
              <CheckCircle size={20} className="mr-2" /> Finish Cleaning
            </button>
          )}
          
          <div className="mt-2 pt-2 border-t border-slate-200">
             <label className="flex items-center space-x-2 text-sm text-slate-500 cursor-pointer p-2 rounded-lg hover:bg-slate-100">
                <Upload size={16} />
                <span>Upload Proof Photo (Optional)</span>
                <input type="file" className="hidden" accept="image/*" />
             </label>
          </div>
        </div>
      )}
      
      {isExpanded && isDone && (
         <div className="p-4 bg-green-50 border-t border-green-100 text-center animate-fadeIn">
            <p className="text-green-700 font-medium text-sm">Completed by {room.assignedTo}</p>
            {room.completedAt && room.startedAt && (
                <p className="text-green-600 text-xs mt-1">
                    Time: {Math.round((room.completedAt - room.startedAt) / 60000)} mins
                </p>
            )}
         </div>
      )}
    </div>
  );
};

export default RoomCard;