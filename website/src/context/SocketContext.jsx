import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeSocket, closeSocket } from '../utils/socket';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);

  // Check for token on mount and when storage changes
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('accessToken');
      setToken(currentToken);
    };

    checkToken();

    // Listen for storage changes (e.g., login in another tab)
    window.addEventListener('storage', checkToken);
    
    // Custom event for same-tab login
    window.addEventListener('login', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('login', checkToken);
    };
  }, []);

  // Initialize socket when token changes
  useEffect(() => {
    if (token) {
      console.log('🔌 Initializing socket with token');
      const socketInstance = initializeSocket(token);
      setSocket(socketInstance);

      return () => {
        console.log('🔌 Closing socket connection');
        closeSocket();
        setSocket(null);
      };
    } else {
      // No token, clean up socket
      if (socket) {
        closeSocket();
        setSocket(null);
      }
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
