// socketClient.js
import { io } from 'socket.io-client';

// Get Socket URL from environment variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

// Create and configure socket instance
const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

// Socket events wrapper
const socketClient = {
  socket,
  
  // Connection methods
  connect: (token) => {
    if (token) {
      socket.auth = { token };
    }
    socket.connect();
  },
  
  disconnect: () => {
    socket.disconnect();
  },
  
  // Event listeners
  onConnect: (callback) => {
    socket.on('connect', callback);
  },
  
  onDisconnect: (callback) => {
    socket.on('disconnect', callback);
  },
  
  onUserCount: (callback) => {
    socket.on('user_count', callback);
  },
  
  onChatMessage: (callback) => {
    socket.on('chat_message', callback);
  },
  
  onUserJoined: (callback) => {
    socket.on('user_joined', callback);
  },
  
  // Event emitters
  setUsername: (username) => {
    socket.emit('set_username', { username });
  },
  
  sendChatMessage: (message) => {
    socket.emit('chat_message', { message });
  },
  
  // Utility to remove all listeners for a specific event
  offEvent: (eventName) => {
    socket.off(eventName);
  },
  
  // Utility to remove all listeners
  offAll: () => {
    socket.offAny();
  },
};

export default socketClient;
