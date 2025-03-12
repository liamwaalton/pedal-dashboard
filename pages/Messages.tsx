
import React, { useState } from 'react';
import MessagesSidebar from '@/components/messages/MessagesSidebar';
import ChatList from '@/components/messages/ChatList';
import ChatWindow from '@/components/messages/ChatWindow';

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

interface ChatContact {
  id: number;
  name: string;
  unread: number;
  isGroup: boolean;
}

const messages: ChatMessage[] = [
  { id: 1, sender: 'Esther Howard', content: 'Hey! Are you joining the community ride this weekend?', time: '10:32 AM', isOwn: false },
  { id: 2, sender: 'You', content: 'Yes, I\'m planning to join. Which route are we taking?', time: '10:35 AM', isOwn: true },
  { id: 3, sender: 'Esther Howard', content: 'The mountain trail! It\'s about 24km with some decent climbs.', time: '10:38 AM', isOwn: false },
  { id: 4, sender: 'You', content: 'Sounds great! I\'ll bring my new mountain bike.', time: '10:41 AM', isOwn: true },
];

const chatContacts: ChatContact[] = [
  { id: 1, name: 'Cycling Group', unread: 3, isGroup: true },
  { id: 2, name: 'Esther Howard', unread: 1, isGroup: false },
  { id: 3, name: 'Jenny Wilson', unread: 0, isGroup: false },
  { id: 4, name: 'Eleanor Pena', unread: 2, isGroup: false },
  { id: 5, name: 'Mountain Bikers', unread: 5, isGroup: true },
];

const Messages = () => {
  const [activeChat, setActiveChat] = useState(2); // Default to Esther Howard

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <MessagesSidebar />
            <ChatList 
              chatContacts={chatContacts} 
              activeChat={activeChat} 
              setActiveChat={setActiveChat} 
            />
            <ChatWindow messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
