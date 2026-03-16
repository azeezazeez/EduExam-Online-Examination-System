import React from 'react';
import { User, Clock } from 'lucide-react';

interface NavbarProps {
  userId: number;
  username: string;
  timeLeft: number;
}

const Navbar: React.FC<NavbarProps> = ({ userId, username, timeLeft }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <User size={20} />
        </div>
        <div>
          <p className="text-xs opacity-80">User ID</p>
          <p className="font-mono font-bold">{userId}</p>
        </div>
      </div>

      <div className="hidden md:block">
        <h1 className="text-xl font-bold tracking-tight uppercase">{username}</h1>
      </div>

      <div className="flex items-center gap-3 bg-indigo-700 px-4 py-2 rounded-full border border-indigo-400/30">
        <Clock size={18} className="text-indigo-200" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider opacity-70 leading-none">Time Left</span>
          <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-400 animate-pulse' : ''}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;