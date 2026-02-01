import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, MoreVertical, Phone, Video, Plus, Smile, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useChats } from '../hooks/useChats';
import { useChat } from '../hooks/useChat';
import api, { BASE_URL } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

export default function ChatDashboard() {
  const { chats, loading: chatsLoading, refresh: refreshChats } = useChats();
  const [activeChat, setActiveChat] = useState(null);
  const { messages, loading: msgsLoading, sending, sendMessage } = useChat(activeChat?._id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  const startChat = async (participant) => {
    try {
      const { data } = await api.post(`/chats/with/${participant._id}`);
      setActiveChat(data.chat);
      setSearchQuery('');
      setSearchResults([]);
      refreshChats();
    } catch (err) {
      console.error("Failed to start chat", err);
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
      console.error("Send failed", err);
    }
  };

  const getAvatar = (uri) => {
    if (!uri) return null;
    if (uri.startsWith('http')) return uri;
    return `${BASE_URL.replace('/api', '')}${uri}`;
  };

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden selection:bg-primary/30 selection:text-primary">
      {/* Sidebar */}
      <div className="w-80 md:w-96 border-r border-white/5 flex flex-col bg-card/10 backdrop-blur-2xl backdrop-saturate-200">
        {/* Sidebar Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-white tracking-tighter">Whisper</h1>
            <Avatar className="h-10 w-10 border border-primary/20 ring-2 ring-primary/5">
              <AvatarImage src={getAvatar(user.avatarUrl)} />
              <AvatarFallback className="bg-secondary text-primary font-bold">
                {user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search people..."
              className="w-full bg-white/5 border-white/5 h-12 pl-12 rounded-2xl focus:border-primary/50 placeholder:text-muted-foreground/40 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 px-4 mt-4">
          <div className="pb-6">
            {searchQuery.trim() ? (
              <>
                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 px-2">Global Search</h2>
                {searching ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="animate-spin text-primary/50" size={24} />
                  </div>
                ) : (
                  searchResults.map(u => (
                    <Button 
                      key={u._id}
                      variant="ghost"
                      onClick={() => startChat(u)}
                      className="w-full h-auto flex items-center justify-start p-3 rounded-2xl hover:bg-white/5 transition-all mb-1 group"
                    >
                      <Avatar className="h-12 w-12 rounded-2xl border border-white/5 group-hover:border-primary/30 transition-colors">
                        <AvatarImage src={getAvatar(u.avatarUrl)} className="object-cover" />
                        <AvatarFallback className="bg-secondary text-muted-foreground">
                          {u.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3 text-left">
                        <p className="text-white font-bold text-sm group-hover:text-primary transition-colors">{u.name}</p>
                        <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">@{u.username}</p>
                      </div>
                    </Button>
                  ))
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Recent Chats</h2>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg hover:bg-white/5">
                    <Plus size={14} className="text-muted-foreground" />
                  </Button>
                </div>
                {chatsLoading && chats.length === 0 ? (
                  <div className="space-y-3 px-2">
                    {[1,2,3,4].map(i => <div key={i} className="h-20 bg-white/5 rounded-[24px] animate-pulse" />)}
                  </div>
                ) : (
                  chats.map(chat => (
                    <button
                      key={chat._id}
                      onClick={() => setActiveChat(chat)}
                      className={`w-full flex items-center p-4 rounded-[28px] transition-all mb-2 relative group ${activeChat?._id === chat._id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}
                    >
                      <Avatar className="h-14 w-14 rounded-2xl border border-white/5 shadow-2xl shadow-black/40">
                        <AvatarImage src={getAvatar(chat.participants.avatarUrl)} className="object-cover" />
                        <AvatarFallback className="bg-secondary text-primary font-bold">
                          {chat.participants.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4 flex-1 overflow-hidden text-left">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className={`font-bold truncate transition-colors ${activeChat?._id === chat._id ? 'text-primary' : 'text-white group-hover:text-primary'}`}>{chat.participants.name}</p>
                          <span className="text-[9px] font-bold text-muted-foreground/60 whitespace-nowrap ml-2">
                            {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs truncate font-medium">
                          {chat.lastMessage?.text || 'New conversation'}
                        </p>
                      </div>
                      <AnimatePresence>
                        {chat.unreadCount > 0 && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50" 
                          />
                        )}
                      </AnimatePresence>
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative bg-background">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-card/5 backdrop-blur-xl z-10 sticky top-0">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 rounded-2xl border border-white/5 shadow-lg">
                  <AvatarImage src={getAvatar(activeChat.participants.avatarUrl)} className="object-cover" />
                  <AvatarFallback className="bg-secondary text-primary font-bold">
                    {activeChat.participants.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h3 className="text-white font-bold leading-none mb-1.5">{activeChat.participants.name}</h3>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[9px] text-success font-black uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                  <Phone size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                  <Video size={20} />
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                  <MoreVertical size={20} />
                </Button>
              </div>
            </header>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-8">
              <div className="space-y-6 max-w-4xl mx-auto pb-6">
                {msgsLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={32} />
                  </div>
                ) : (
                  <>
                    {messages.map((m, i) => {
                      const isMe = m.sender._id === user.id;
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          key={m._id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMe && (
                            <Avatar className="h-8 w-8 rounded-xl border border-white/5 mr-3 self-end shadow-md">
                              <AvatarImage src={getAvatar(activeChat.participants.avatarUrl)} />
                              <AvatarFallback className="text-[10px] bg-secondary font-bold">
                                {activeChat.participants.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`max-w-[70%] px-5 py-4 rounded-[28px] ${isMe ? 'bg-primary text-white rounded-br-none shadow-xl shadow-primary/20' : 'bg-card border border-white/5 text-white rounded-bl-none shadow-lg'}`}>
                            <p className="text-[15px] leading-relaxed font-medium">{m.text}</p>
                            <span className={`text-[9px] mt-2 block font-black uppercase tracking-wider ${isMe ? 'text-white/60' : 'text-muted-foreground'} text-right`}>
                              {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-8 pt-0">
              <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end space-x-3 bg-card border border-white/5 p-2.5 rounded-[32px] shadow-2xl">
                <Button type="button" variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                  <Plus size={24} />
                </Button>
                <div className="flex-1 flex flex-col justify-center min-h-[48px]">
                  <textarea
                    rows="1"
                    placeholder="Whisper something..."
                    className="w-full bg-transparent text-white resize-none text-[15px] font-medium max-h-32 py-3 outline-none px-1 placeholder:text-muted-foreground/40"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary transition-all">
                    <Smile size={22} />
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!messageText.trim() || sending}
                    className={`h-12 w-12 rounded-[20px] shadow-lg shadow-primary/20 p-0 ${messageText.trim() ? 'opacity-100' : 'opacity-40 animate-pulse'}`}
                  >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-linear-to-b from-background to-card/20">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-150" />
              <div className="w-28 h-28 bg-card border border-white/10 rounded-[44px] flex items-center justify-center relative shadow-2xl">
                <MessageSquare size={48} className="text-primary/40" />
              </div>
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-white mb-4 tracking-tight"
            >
              Start Your Story
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground max-w-sm mb-12 leading-relaxed font-medium"
            >
              Search for friends to start a private conversation or select an existing chat to continue where you left off.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-full border border-white/10"
            >
              <Shield size={16} className="text-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">End-to-End Encrypted</span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
