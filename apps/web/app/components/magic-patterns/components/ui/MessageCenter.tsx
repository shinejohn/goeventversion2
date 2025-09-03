import React, { useState } from 'react';
import { MessageSquareIcon, UserIcon, XIcon, SendIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
type Message = {
  id: number;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  isRead: boolean;
};
type Conversation = {
  id: number;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
};
export const MessageCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const navigate = useNavigate();
  // Mock conversations
  const [conversations, setConversations] = useState<Conversation[]>([{
    id: 1,
    user: {
      id: 'user-1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    lastMessage: 'Are you going to the Jazz Festival this weekend?',
    timestamp: '10:23 AM',
    unreadCount: 2
  }, {
    id: 2,
    user: {
      id: 'user-2',
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    lastMessage: 'Thanks for sharing the event details!',
    timestamp: 'Yesterday',
    unreadCount: 0
  }, {
    id: 3,
    user: {
      id: 'user-3',
      name: 'Emma Williams',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    lastMessage: 'I just bought tickets for the concert. Want to meet up?',
    timestamp: 'Yesterday',
    unreadCount: 0
  }]);
  // Mock messages for each conversation
  const [messages, setMessages] = useState<{
    [key: number]: Message[];
  }>({
    1: [{
      id: 101,
      sender: {
        id: 'user-1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Hey there! Have you heard about the Jazz Festival?',
      timestamp: 'Yesterday, 3:45 PM',
      isRead: true
    }, {
      id: 102,
      sender: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Yes, I saw it on the events page. Looks amazing!',
      timestamp: 'Yesterday, 4:00 PM',
      isRead: true
    }, {
      id: 103,
      sender: {
        id: 'user-1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Are you going to the Jazz Festival this weekend?',
      timestamp: 'Today, 10:23 AM',
      isRead: false
    }, {
      id: 104,
      sender: {
        id: 'user-1',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'I already got my tickets!',
      timestamp: 'Today, 10:24 AM',
      isRead: false
    }],
    2: [{
      id: 201,
      sender: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Hey Michael, check out this new event I found!',
      timestamp: 'Yesterday, 11:30 AM',
      isRead: true
    }, {
      id: 202,
      sender: {
        id: 'user-2',
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Thanks for sharing the event details!',
      timestamp: 'Yesterday, 12:15 PM',
      isRead: true
    }],
    3: [{
      id: 301,
      sender: {
        id: 'user-3',
        name: 'Emma Williams',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Have you seen the lineup for the summer concert series?',
      timestamp: 'Yesterday, 9:45 AM',
      isRead: true
    }, {
      id: 302,
      sender: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'Not yet, is it good?',
      timestamp: 'Yesterday, 10:00 AM',
      isRead: true
    }, {
      id: 303,
      sender: {
        id: 'user-3',
        name: 'Emma Williams',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: 'I just bought tickets for the concert. Want to meet up?',
      timestamp: 'Yesterday, 10:15 AM',
      isRead: true
    }]
  });
  const getTotalUnreadCount = () => {
    return conversations.reduce((count, conversation) => count + conversation.unreadCount, 0);
  };
  const markConversationAsRead = (conversationId: number) => {
    setConversations(conversations.map(conv => conv.id === conversationId ? {
      ...conv,
      unreadCount: 0
    } : conv));
    if (messages[conversationId]) {
      setMessages({
        ...messages,
        [conversationId]: messages[conversationId].map(msg => ({
          ...msg,
          isRead: true
        }))
      });
    }
  };
  const handleConversationClick = (conversationId: number) => {
    setActiveConversation(conversationId);
    markConversationAsRead(conversationId);
  };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;
    const newMessage: Message = {
      id: Date.now(),
      sender: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      content: messageText,
      timestamp: 'Just now',
      isRead: true
    };
    // Update messages for the active conversation
    setMessages({
      ...messages,
      [activeConversation]: [...(messages[activeConversation] || []), newMessage]
    });
    // Update the conversation's last message
    setConversations(conversations.map(conv => conv.id === activeConversation ? {
      ...conv,
      lastMessage: messageText,
      timestamp: 'Just now'
    } : conv));
    setMessageText('');
  };
  const handleBackToConversations = () => {
    setActiveConversation(null);
  };
  const viewAllMessages = () => {
    navigate('/messages');
    setIsOpen(false);
  };
  return <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-1 text-gray-700 hover:text-gray-900 focus:outline-none" aria-label="Messages">
        <MessageSquareIcon className="h-6 w-6" />
        {getTotalUnreadCount() > 0 && <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {getTotalUnreadCount()}
          </span>}
      </button>
      {isOpen && <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="h-96 flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">
                {activeConversation ? conversations.find(c => c.id === activeConversation)?.user.name || 'Conversation' : 'Messages'}
              </h3>
              <div className="flex items-center">
                {activeConversation && <button className="text-gray-500 hover:text-gray-700 mr-2" onClick={handleBackToConversations}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  </button>}
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsOpen(false)}>
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            {/* Conversation List or Message Thread */}
            <div className="flex-1 overflow-y-auto">
              {activeConversation ?
          // Message Thread
          <div className="p-3 space-y-3">
                  {messages[activeConversation]?.map(message => <div key={message.id} className={`flex ${message.sender.id === 'current-user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${message.sender.id === 'current-user' ? 'bg-indigo-100 rounded-tl-lg rounded-tr-lg rounded-bl-lg' : 'bg-gray-100 rounded-tl-lg rounded-tr-lg rounded-br-lg'} px-3 py-2`}>
                        {message.sender.id !== 'current-user' && <div className="flex items-center mb-1">
                            <div className="h-6 w-6 rounded-full overflow-hidden mr-2">
                              <img src={message.sender.avatar} alt={message.sender.name} className="h-full w-full object-cover" />
                            </div>
                            <span className="text-xs font-medium text-gray-900">
                              {message.sender.name}
                            </span>
                          </div>}
                        <p className="text-sm text-gray-800">
                          {message.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>)}
                </div> :
          // Conversation List
          <div>
                  {conversations.length === 0 ? <div className="p-6 text-center">
                      <UserIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No messages yet</p>
                    </div> : conversations.map(conversation => <button key={conversation.id} className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 flex items-start ${conversation.unreadCount > 0 ? 'bg-blue-50' : ''}`} onClick={() => handleConversationClick(conversation.id)}>
                        <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                          <img src={conversation.user.avatar} alt={conversation.user.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {conversation.user.name}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && <div className="ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>}
                      </button>)}
                </div>}
            </div>
            {/* Message Input (only when conversation is active) */}
            {activeConversation && <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex items-center">
                <input type="text" className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Type a message..." value={messageText} onChange={e => setMessageText(e.target.value)} />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md p-2">
                  <SendIcon className="h-4 w-4" />
                </button>
              </form>}
            {/* Footer */}
            <div className="border-t border-gray-200 py-2 px-4 text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-800" onClick={viewAllMessages}>
                View all messages
              </button>
            </div>
          </div>
        </div>}
    </div>;
};