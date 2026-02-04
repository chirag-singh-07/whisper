import React, { useState, useEffect, useRef } from 'react';
import { useChats } from '../hooks/useChats';
import { useChat } from '../hooks/useChat';
import api, { BASE_URL } from '../utils/api';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import LoadingScreen from './ui/LoadingScreen';

// Refactored Components
import Sidebar from './chat/Sidebar';
import MessageArea from './chat/MessageArea';
import UserDossier from './chat/UserDossier';

export default function ChatDashboard() {
  const { chats, loading: chatsLoading, refresh: refreshChats } = useChats();
  const [activeChat, setActiveChat] = useState(null);
  const { messages, loading: msgsLoading, sending, sendMessage } = useChat(activeChat?._id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [showDossier, setShowDossier] = useState(true);
  
  const messagesEndRef = useRef(null);
  
  // Safe JSON parse for user data
  const userStr = localStorage.getItem('user');
  const user = (userStr && userStr !== 'undefined') ? JSON.parse(userStr) : {};

  useEffect(() => {
    if (activeChat) setShowDossier(true);
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      try {
        const { data } = await api.get(`/users/search?query=${searchQuery}`);
        setSearchResults(data.users || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle Loading State
  if (chatsLoading && chats.length === 0) {
    return <LoadingScreen message="Decrypting your messages..." />;
  }

  const startChat = async (participant) => {
    try {
      const { data } = await api.post(`/chats/with/${participant._id}`);
      setActiveChat(data.chat);
      setSearchQuery('');
      setSearchResults([]);
      refreshChats();
    } catch (err) {
      toast.error("Failed to initiate chat");
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || sending) return;
    try {
      await sendMessage(messageText);
      setMessageText('');
      refreshChats();
    } catch (err) {
      toast.error("Message could not be sent");
    }
  };

  const getAvatar = (uri) => {
    if (!uri) return null;
    if (uri.startsWith('http')) return uri;
    return `${BASE_URL.replace('/api', '')}${uri}`;
  };

  return (
    <div className="h-screen w-full flex bg-[#0A0A0B] text-white overflow-hidden selection:bg-primary/30 selection:text-primary">
      
      <Sidebar 
        user={user}
        chats={chats}
        chatsLoading={chatsLoading}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchResults={searchResults}
        searching={searching}
        startChat={startChat}
        getAvatar={getAvatar}
      />

      <MessageArea 
        activeChat={activeChat}
        messages={messages}
        msgsLoading={msgsLoading}
        user={user}
        getAvatar={getAvatar}
        showDetails={showDossier}
        setShowDetails={setShowDossier}
        messageText={messageText}
        setMessageText={setMessageText}
        handleSend={handleSend}
        sending={sending}
        messagesEndRef={messagesEndRef}
      />

      <AnimatePresence>
        {activeChat && showDossier && (
          <UserDossier 
            activeChat={activeChat}
            getAvatar={getAvatar}
            setShowDetails={setShowDossier}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
