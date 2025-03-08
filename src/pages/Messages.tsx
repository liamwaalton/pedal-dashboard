
import React from 'react';
import { MessageSquare, Search, Users, ChevronDown, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidebarNavItem from '@/components/SidebarNavItem';
import SearchInput from '@/components/SearchInput';
import SupportCard from '@/components/SupportCard';

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  time: string;
  isOwn: boolean;
}

const messages: ChatMessage[] = [
  { id: 1, sender: 'Esther Howard', content: 'Hey! Are you joining the community ride this weekend?', time: '10:32 AM', isOwn: false },
  { id: 2, sender: 'You', content: 'Yes, I\'m planning to join. Which route are we taking?', time: '10:35 AM', isOwn: true },
  { id: 3, sender: 'Esther Howard', content: 'The mountain trail! It\'s about 24km with some decent climbs.', time: '10:38 AM', isOwn: false },
  { id: 4, sender: 'You', content: 'Sounds great! I\'ll bring my new mountain bike.', time: '10:41 AM', isOwn: true },
];

const chatContacts = [
  { id: 1, name: 'Cycling Group', unread: 3, isGroup: true },
  { id: 2, name: 'Esther Howard', unread: 1, isGroup: false },
  { id: 3, name: 'Jenny Wilson', unread: 0, isGroup: false },
  { id: 4, name: 'Eleanor Pena', unread: 2, isGroup: false },
  { id: 5, name: 'Mountain Bikers', unread: 5, isGroup: true },
];

const Messages = () => {
  const [activeChat, setActiveChat] = React.useState(2); // Default to Esther Howard

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center h-8 w-8 bg-gray-900 rounded-md text-white">
                  <span className="text-xs">🚲</span>
                </div>
                <h1 className="text-lg font-bold">Pedal Dashboard</h1>
              </div>
              
              <p className="text-sm text-gray-500 mb-4">Your Management dashboard</p>
              
              <div className="mb-6">
                <SearchInput placeholder="Search Your Items ..." />
              </div>
              
              <div className="mb-4">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Main Items</h2>
                <nav className="space-y-1">
                  <SidebarNavItem 
                    icon={<MessageSquare size={20} />} 
                    label="Messages" 
                    active={true}
                  />
                </nav>
              </div>
              
              <SupportCard />
            </div>
            
            {/* Chat List */}
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
            
            {/* Chat Window */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
