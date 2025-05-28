import { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let newSocket;
    
    if (isOpen) {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Vui lòng đăng nhập để sử dụng chat', { variant: 'warning' });
        setIsOpen(false);
        return;
      }

      try {
        newSocket = io('https://shopstorebe.onrender.com');
        setSocket(newSocket);

        // Register user with their ID and username
        const userStr = localStorage.getItem('user');
        console.log('User data from localStorage:', userStr);

        if (!userStr) {
          enqueueSnackbar('Không tìm thấy thông tin người dùng', { variant: 'error' });
          setIsOpen(false);
          return;
        }

        let user;
        try {
          user = JSON.parse(userStr);
          console.log('Parsed user data:', user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          enqueueSnackbar('Lỗi đọc thông tin người dùng', { variant: 'error' });
          setIsOpen(false);
          return;
        }

        // Gửi thông tin user bao gồm cả username
        const userData = {
          userId: user.id || user._id,
          username: user.username || user.name
        };
        console.log('Registering user with data:', userData);
        newSocket.emit('register', userData);

        newSocket.on('privateMessage', (data) => {
          console.log('Received message:', data);
          setMessages((prevMessages) => [...prevMessages, {
            ...data,
            timestamp: new Date()
          }]);
        });

        newSocket.on('typing', ({ username, isTyping }) => {
          if (username === 'admin') {
            setAdminTyping(isTyping);
          }
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          enqueueSnackbar('Không thể kết nối với máy chủ chat', { variant: 'error' });
          setIsOpen(false);
        });

      } catch (error) {
        console.error('Socket initialization error:', error);
        enqueueSnackbar('Lỗi khởi tạo kết nối chat', { variant: 'error' });
        setIsOpen(false);
      }
    }

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [isOpen, enqueueSnackbar]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      try {
        const messageData = {
          recipientId: 'admin',
          message: message.trim()
        };
        console.log('Sending message:', messageData);
        
        socket.emit('privateMessage', messageData);
        setMessages((prevMessages) => [...prevMessages, { 
          senderId: 'user', 
          message: message.trim(),
          timestamp: new Date()
        }]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        enqueueSnackbar('Lỗi gửi tin nhắn', { variant: 'error' });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (isTyping) => {
    if (socket) {
      try {
        socket.emit('typing', { recipientId: 'admin', isTyping });
        setIsTyping(isTyping);
      } catch (error) {
        console.error('Error sending typing status:', error);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <FaComments className="text-2xl" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Chat với nhân viên</h3>

            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.senderId === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.senderId === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {format(msg.timestamp, 'HH:mm', { locale: vi })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping(e.target.value.length > 0);
                }}
                onKeyPress={handleKeyPress}
                onBlur={() => handleTyping(false)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="1"
              />
              <button 
                onClick={sendMessage}
                disabled={!message.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup; 