import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUser, FaSearch, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import io from 'socket.io-client';

const AdminChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(null);
  const messagesEndRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      enqueueSnackbar('Please login to access chat', { variant: 'warning' });
      return;
    }

    const newSocket = io('https://shopstorebe.onrender.com', {
      auth: {
        token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      // Đăng ký admin
      newSocket.emit('register', { userId: 'admin' });
    });

    newSocket.on('userConnected', (user) => {
      setUsers(prevUsers => [...prevUsers, user]);
      enqueueSnackbar(`${user.username} has joined the chat`, { variant: 'info' });
    });

    newSocket.on('userDisconnected', (user) => {
      setUsers(prevUsers => prevUsers.filter(u => u.socketId !== user.socketId));
      if (selectedUser?.socketId === user.socketId) {
        setSelectedUser(null);
      }
      enqueueSnackbar(`${user.username} has left the chat`, { variant: 'info' });
    });

    newSocket.on('privateMessage', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    newSocket.on('typing', (data) => {
      if (data.isTyping) {
        setUserTyping(data.username);
      } else {
        setUserTyping(null);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      recipientId: selectedUser.socketId,
      message: newMessage
    };

    socket.emit('privateMessage', messageData);
    setMessages(prev => [...prev, {
      senderId: 'admin',
      message: newMessage,
      timestamp: new Date()
    }]);
    setNewMessage('');
    scrollToBottom();
  };

  const handleTyping = (isTyping) => {
    if (!selectedUser) return;
    socket.emit('typing', {
      recipientId: selectedUser.socketId,
      isTyping
    });
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          {filteredUsers.map(user => (
            <div
              key={user.socketId}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                selectedUser?.socketId === user.socketId ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUser className="text-blue-500" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-3">
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FaUser className="text-blue-500" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-3">
                  <p className="font-medium">{selectedUser.username}</p>
                  <p className="text-sm text-gray-500">
                    {userTyping ? `${userTyping} is typing...` : 'Online'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.senderId === 'admin' ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === 'admin'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center">
                <textarea
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="1"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping(true);
                  }}
                  onBlur={() => handleTyping(false)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <FaUser className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No user selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select a user from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;