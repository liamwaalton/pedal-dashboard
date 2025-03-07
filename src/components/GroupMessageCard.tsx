
import React from 'react';
import { Plus } from 'lucide-react';

interface Friend {
  id: number;
  name: string;
  username: string;
  count?: number;
}

const friends: Friend[] = [
  { id: 1, name: 'Esther Howard', username: 'esd21', count: 2 },
  { id: 2, name: 'Jenny Wilson', username: 'jennwil', count: 1 },
  { id: 3, name: 'Eleanor Pena', username: 'elenopena', count: 6 },
];

const GroupMessageCard = () => {
  return (
    <div className="bike-card animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm text-gray-500">Group Messasge</h2>
        <button className="text-bike-blue">
          <Plus size={18} />
        </button>
      </div>
      
      <h3 className="text-sm font-medium text-gray-500 mb-2">Your Friends</h3>
      
      <div className="space-y-3">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full overflow-hidden"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">{friend.name}</p>
                <p className="text-xs text-gray-500">@{friend.username}</p>
              </div>
            </div>
            {friend.count && (
              <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-medium">{friend.count}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="relative mt-6">
        <input
          type="text"
          placeholder="Send Message ..."
          className="w-full py-2 pl-4 pr-10 rounded-xl bg-gray-100/70 text-sm focus:outline-none focus:ring-1 focus:ring-bike-blue"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bike-blue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GroupMessageCard;
