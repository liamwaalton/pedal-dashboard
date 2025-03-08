
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchInput from '@/components/SearchInput';

interface ChatContact {
  id: number;
  name: string;
  unread: number;
  isGroup: boolean;
}

interface ChatListProps {
  chatContacts: ChatContact[];
  activeChat: number;
  setActiveChat: (id: number) => void;
}

const ChatList = ({ chatContacts, activeChat, setActiveChat }: ChatListProps) => {
  return (
    <div className="lg:col-span-3">
      <div className="bike-card h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Chats</h2>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Users size={20} />
          </Button>
        </div>
        
        <div className="mb-4">
          <SearchInput placeholder="Search messages..." />
        </div>
        
        <div className="space-y-2 flex-grow overflow-y-auto">
          {chatContacts.map((contact) => (
            <div 
              key={contact.id} 
              className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer ${activeChat === contact.id ? 'bg-bike-blue text-white' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveChat(contact.id)}
            >
              <div className={`h-10 w-10 ${contact.isGroup ? 'bg-bike-orange' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                {contact.isGroup ? <Users size={16} className="text-white" /> : contact.name.charAt(0)}
              </div>
              <div className="flex-grow">
                <p className={`font-medium ${activeChat === contact.id ? 'text-white' : 'text-gray-800'}`}>{contact.name}</p>
                <p className={`text-xs ${activeChat === contact.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {contact.isGroup ? 'Group chat' : 'Direct message'}
                </p>
              </div>
              {contact.unread > 0 && (
                <div className={`h-6 w-6 rounded-full ${activeChat === contact.id ? 'bg-white text-bike-blue' : 'bg-bike-blue text-white'} flex items-center justify-center`}>
                  <span className="text-xs font-medium">{contact.unread}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
