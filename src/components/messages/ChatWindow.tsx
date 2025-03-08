
import React from 'react';
import { Search, ChevronDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

interface ChatWindowProps {
  messages: ChatMessage[];
}

const ChatWindow = ({ messages }: ChatWindowProps) => {
  return (
    <div className="lg:col-span-6">
      <div className="bike-card h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-200 rounded-full overflow-hidden"></div>
            <div>
              <h3 className="font-medium">Esther Howard</h3>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Search size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <ChevronDown size={20} />
            </Button>
          </div>
        </div>
        
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-2xl p-3 ${message.isOwn ? 'bg-bike-blue text-white' : 'bg-gray-100'}`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 text-right ${message.isOwn ? 'text-white/80' : 'text-gray-500'}`}>{message.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="relative">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full py-3 pl-4 pr-12 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-bike-blue"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-bike-blue rounded-full w-8 h-8 p-0 flex items-center justify-center">
              <Send size={16} className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
