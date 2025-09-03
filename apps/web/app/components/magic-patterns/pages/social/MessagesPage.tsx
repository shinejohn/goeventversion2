import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { SearchIcon, PaperclipIcon, SmileIcon, SendIcon, PhoneIcon, VideoIcon, InfoIcon, MoreHorizontalIcon, ImageIcon, FileIcon, MicIcon, MapPinIcon, CheckIcon, ChevronDownIcon, PlusIcon, UserPlusIcon } from 'lucide-react';
// Mock data for conversations
const mockConversations = [{
  id: 'conv-1',
  participants: [{
    id: 'user-234',
    name: 'Jessica Taylor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: true
  }],
  lastMessage: {
    text: 'Hey! Are you going to the concert tonight?',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    read: true,
    sender: 'user-234'
  },
  unread: 0
}, {
  id: 'conv-2',
  participants: [{
    id: 'user-345',
    name: 'Marcus Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: false
  }],
  lastMessage: {
    text: 'I just got tickets for the jazz festival next month!',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    read: false,
    sender: 'user-345'
  },
  unread: 3
}, {
  id: 'conv-3',
  participants: [{
    id: 'user-456',
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    online: true
  }],
  lastMessage: {
    text: 'Thanks for the venue recommendation! It was perfect for our event.',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    read: true,
    sender: 'user-123' // current user
  },
  unread: 0
}, {
  id: 'conv-4',
  group: true,
  name: 'Clearwater Music Festival Planning',
  avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  participants: [{
    id: 'user-234',
    name: 'Jessica Taylor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }, {
    id: 'user-345',
    name: 'Marcus Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }, {
    id: 'user-456',
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }],
  lastMessage: {
    text: 'Jessica: I found a great sound equipment vendor for us.',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: false,
    sender: 'user-234'
  },
  unread: 12
}, {
  id: 'conv-5',
  participants: [{
    id: 'venue-1',
    name: 'Capitol Theatre',
    avatar: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    type: 'venue',
    online: true
  }],
  lastMessage: {
    text: 'Your booking request has been confirmed for July 15th.',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    read: true,
    sender: 'venue-1'
  },
  unread: 0
}];
// Mock messages for a conversation
const generateMockMessages = (conversationId: string) => {
  const conversation = mockConversations.find(c => c.id === conversationId);
  if (!conversation) return [];
  const otherParticipantId = conversation.participants[0].id;
  const currentUserId = 'user-123';
  // Generate a conversation with 15-25 messages
  const messageCount = Math.floor(Math.random() * 10) + 15;
  const messages = [];
  let lastDate = new Date();
  lastDate.setHours(lastDate.getHours() - messageCount);
  for (let i = 0; i < messageCount; i++) {
    // Add some time between messages
    const minutesAgo = Math.floor(Math.random() * 30) + 5;
    lastDate = new Date(lastDate.getTime() + minutesAgo * 60000);
    // Determine sender (more likely to be the other participant)
    const sender = Math.random() > 0.4 ? otherParticipantId : currentUserId;
    // Create message
    messages.push({
      id: `msg-${conversationId}-${i}`,
      text: getRandomMessage(sender === currentUserId),
      timestamp: lastDate.toISOString(),
      sender,
      read: true
    });
  }
  // Add the last message from the conversation data
  if (conversation.lastMessage) {
    messages.push({
      id: `msg-${conversationId}-last`,
      text: conversation.lastMessage.text.replace(/^.*?: /, ''),
      timestamp: conversation.lastMessage.timestamp,
      sender: conversation.lastMessage.sender,
      read: conversation.lastMessage.read
    });
  }
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};
// Helper to generate random message content
const getRandomMessage = (isSelf: boolean) => {
  const selfMessages = ["Hey, how's it going?", 'Are you planning to attend the event this weekend?', 'I saw that new venue downtown. It looks amazing!', 'What time does the show start tonight?', 'Have you heard the new album by that local band?', 'Can you send me the link to buy tickets?', "I'm thinking of organizing a group to go to the jazz festival.", "Did you see who's performing at the beach concert?", 'Thanks for the recommendation!', 'Let me know if you want to meet up before the show.'];
  const otherMessages = ["I'm doing well, thanks! How about you?", 'Yes, I already got tickets. Did you?', 'Oh really? We should check it out sometime.', 'I think doors open at 7, show starts at 8.', 'Not yet, is it good?', 'Sure, here you go: [ticket link]', 'That sounds fun! Count me in.', 'Yeah, the lineup looks amazing this year.', 'No problem! Let me know how you like it.', 'Definitely! How about we meet at the coffee shop at 6?'];
  const messages = isSelf ? selfMessages : otherMessages;
  return messages[Math.floor(Math.random() * messages.length)];
};
const MessagesPage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const msgs = generateMockMessages(selectedConversation);
      setMessages(msgs);
      // Mark messages as read
      setConversations(conversations.map(conv => conv.id === selectedConversation ? {
        ...conv,
        unread: 0,
        lastMessage: {
          ...conv.lastMessage,
          read: true
        }
      } : conv));
    }
  }, [selectedConversation]);
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  // Format date for message groups
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: {
      date: string;
      messages: any[];
    }[] = [];
    let currentDate = '';
    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: formatMessageDate(message.timestamp),
          messages: [message]
        });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });
    return groups;
  };
  // Send a new message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: messageText,
      timestamp: new Date().toISOString(),
      sender: 'user-123',
      read: false
    };
    setMessages([...messages, newMessage]);
    setMessageText('');
    // Update conversation with new last message
    setConversations(conversations.map(conv => conv.id === selectedConversation ? {
      ...conv,
      lastMessage: {
        text: messageText,
        timestamp: newMessage.timestamp,
        read: false,
        sender: 'user-123'
      }
    } : conv));
  };
  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    if (conv.group && conv.name) {
      return conv.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });
  // Get the current conversation object
  const currentConversation = conversations.find(c => c.id === selectedConversation);
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-12rem)]">
          {/* Conversation list */}
          <div className="md:w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold">Messages</h1>
              <div className="mt-2 relative">
                <input type="text" placeholder="Search conversations" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-2 flex justify-between">
                <button className="text-sm text-indigo-600 font-medium">
                  All Messages
                </button>
                <button className="text-sm text-gray-600 font-medium">
                  Unread
                </button>
                <button onClick={() => navigate('/social/messages/new')} className="text-sm text-indigo-600 font-medium flex items-center">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  New Message
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredConversations.map(conversation => <div key={conversation.id} className={`p-3 border-b border-gray-100 cursor-pointer ${selectedConversation === conversation.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedConversation(conversation.id)}>
                  <div className="flex items-center">
                    {/* Avatar */}
                    <div className="relative">
                      {conversation.group ? <img src={conversation.avatar} alt={conversation.name} className="h-12 w-12 rounded-lg object-cover" /> : <img src={conversation.participants[0].avatar} alt={conversation.participants[0].name} className="h-12 w-12 rounded-full object-cover" />}
                      {!conversation.group && conversation.participants[0].online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>}
                      {conversation.participants[0].type === 'venue' && <span className="absolute bottom-0 right-0 block h-5 w-5 rounded-full bg-blue-100 ring-2 ring-white text-blue-600 flex items-center justify-center text-xs">
                          V
                        </span>}
                    </div>
                    {/* Conversation info */}
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.group ? conversation.name : conversation.participants[0].name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conversation.unread > 0 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                        {conversation.lastMessage.sender === 'user-123' && 'You: '}
                        {conversation.lastMessage.text}
                      </p>
                    </div>
                    {/* Unread indicator */}
                    {conversation.unread > 0 && <span className="ml-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unread}
                      </span>}
                  </div>
                </div>)}
            </div>
          </div>
          {/* Message area */}
          {selectedConversation ? <div className="md:w-2/3 flex flex-col">
              {/* Conversation header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  {currentConversation?.group ? <>
                      <img src={currentConversation.avatar} alt={currentConversation.name} className="h-10 w-10 rounded-lg object-cover" />
                      <div className="ml-3">
                        <h2 className="text-lg font-medium text-gray-900">
                          {currentConversation.name}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {currentConversation.participants.length} members
                        </p>
                      </div>
                    </> : <>
                      <img src={currentConversation?.participants[0].avatar} alt={currentConversation?.participants[0].name} className="h-10 w-10 rounded-full object-cover" />
                      <div className="ml-3">
                        <h2 className="text-lg font-medium text-gray-900">
                          {currentConversation?.participants[0].name}
                        </h2>
                        <p className="text-xs text-gray-500">
                          {currentConversation?.participants[0].online ? 'Online now' : 'Offline'}
                        </p>
                      </div>
                    </>}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <PhoneIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <VideoIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <InfoIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {groupMessagesByDate().map((group, groupIndex) => <div key={groupIndex} className="mb-6">
                    <div className="flex justify-center mb-4">
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        {group.date}
                      </span>
                    </div>
                    {group.messages.map((message, messageIndex) => {
                const isSelf = message.sender === 'user-123';
                const showAvatar = messageIndex === 0 || group.messages[messageIndex - 1].sender !== message.sender;
                return <div key={message.id} className={`flex mb-4 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                          {!isSelf && showAvatar && <img src={currentConversation?.participants.find(p => p.id === message.sender)?.avatar || ''} alt="Avatar" className="h-8 w-8 rounded-full mr-2 mt-1" />}
                          {!isSelf && !showAvatar && <div className="w-8 mr-2"></div>}
                          <div className={`max-w-xs lg:max-w-md ${isSelf ? 'order-1' : 'order-2'}`}>
                            <div className={`px-4 py-2 rounded-lg ${isSelf ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                              <p className="text-sm">{message.text}</p>
                            </div>
                            <div className={`text-xs mt-1 flex items-center ${isSelf ? 'justify-end text-gray-500' : 'justify-start text-gray-500'}`}>
                              {formatMessageTime(message.timestamp)}
                              {isSelf && <CheckIcon className={`h-3 w-3 ml-1 ${message.read ? 'text-blue-500' : 'text-gray-400'}`} />}
                            </div>
                          </div>
                        </div>;
              })}
                  </div>)}
                <div ref={messagesEndRef} />
              </div>
              {/* Message input */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-end">
                  <div className="flex space-x-2 mr-2">
                    <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                      <PaperclipIcon className="h-5 w-5" />
                    </button>
                    <div className="relative group">
                      <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <PlusIcon className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-full mb-2 left-0 hidden group-hover:flex bg-white shadow-lg rounded-lg p-2 space-x-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                          <ImageIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                          <FileIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                          <MicIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                          <MapPinIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <textarea placeholder="Type a message..." className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none" rows={1} value={messageText} onChange={e => setMessageText(e.target.value)} onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}></textarea>
                    <button type="button" className="absolute right-3 bottom-3 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                      <SmileIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <button type="submit" className="ml-2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={!messageText.trim()}>
                    <SendIcon className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div> : <div className="md:w-2/3 flex flex-col items-center justify-center p-8 bg-gray-50">
              <div className="text-center">
                <div className="bg-indigo-100 p-6 rounded-full inline-flex items-center justify-center mb-4">
                  <MessageCircleIcon className="h-12 w-12 text-indigo-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Your Messages
                </h2>
                <p className="text-gray-600 mb-6">
                  Select a conversation or start a new one to begin messaging
                </p>
                <button onClick={() => navigate('/social/messages/new')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <UserPlusIcon className="h-5 w-5 mr-2" />
                  New Conversation
                </button>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default MessagesPage;