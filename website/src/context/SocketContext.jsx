import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeSocket, closeSocket } from '../utils/socket';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  // Get token from localStorage - this should be reactive in a real auth context
  // but for now we'll check on mount
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (token) {
      const socketInstance = initializeSocket(token);
      setSocket(socketInstance);

      return () => {
        closeSocket();
        setSocket(null);
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
