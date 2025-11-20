import React, { useState } from 'react';
import { User } from '../types';
import { USERS } from '../constants';
import { User as UserIcon, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === selectedUser);
    
    if (!user) {
      setError('Please select a user.');
      return;
    }

    if (user.username === 'Admin') {
        if (password !== '#5FS#HK') {
            setError('Invalid Admin Password');
            return;
        }
    }

    onLogin(user);
  };

  const handleUserSelect = (username: string) => {
      setSelectedUser(username);
      setError('');
      setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <UserIcon size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Vitre Manager</h1>
          <p className="text-slate-500 mt-2">Glass Cleaning Team Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Select User</label>
            <div className="grid grid-cols-3 gap-2">
              {USERS.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleUserSelect(user.username)}
                  className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                    selectedUser === user.username
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {user.username}
                </button>
              ))}
            </div>
          </div>

          {selectedUser === 'Admin' && (
              <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                      <Lock size={14} className="mr-1"/> Admin Password
                  </label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                    autoFocus
                  />
              </div>
          )}

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            disabled={!selectedUser}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">Restricted Access • Hotel Staff Only</p>
        </div>
      </div>
    </div>
  );
};

export default Login;