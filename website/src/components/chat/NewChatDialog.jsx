import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, UserPlus, MessageSquare, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRequests } from '../../hooks/useRequests';
import api from '../../utils/api';

export default function NewChatDialog({ isOpen, onClose, startChat, getAvatar }) {
  const { sendRequest } = useRequests();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/users/search?query=${query}`);
        setResults(data.users || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleStartChat = async (user) => {
    await startChat(user);
    onClose();
    setQuery('');
    setResults([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111113] border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[600px]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <UserPlus size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">New Chat</h2>
                    <p className="text-xs text-muted-foreground">Start a conversation</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Search Container */}
              <div className="p-4 bg-white/2">
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search by name or username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full h-12 bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 size={16} className="animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </div>

              {/* Results List */}
              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {!query.trim() && (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/30 gap-3">
                    <MessageSquare size={48} strokeWidth={1} />
                    <p className="text-sm font-medium">Type to search for people</p>
                  </div>
                )}

                {query.trim() && !loading && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground/30 gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                       <X size={24} />
                    </div>
                    <p className="text-sm font-medium">No users found</p>
                  </div>
                )}

                <div className="space-y-1">
                  {results.map((user) => (
                    <div
                      key={user._id}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                         <Avatar className="h-12 w-12 border border-white/5 rounded-2xl">
                           <AvatarImage src={getAvatar(user.avatarUrl)} className="object-cover" />
                           <AvatarFallback className="bg-secondary text-muted-foreground font-bold rounded-2xl">
                             {user.name?.charAt(0)}
                           </AvatarFallback>
                         </Avatar>
                         <div className="flex-1 min-w-0 text-left">
                           <h3 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors truncate">
                             {user.name}
                           </h3>
                           <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors truncate">
                             @{user.username}
                           </p>
                         </div>
                      </div>

                      {user.connectionStatus === 'friends' ? (
                         <button 
                           onClick={() => handleStartChat(user)}
                           className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-all hover:bg-primary hover:text-white"
                           title="Start Chat"
                         >
                            <MessageSquare size={16} className="fill-current" />
                         </button>
                      ) : user.connectionStatus === 'pending_sent' ? (
                         <div className="px-3 py-1.5 rounded-xl bg-white/5 text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 cursor-default">
                            <Clock size={12} />
                            <span>Sent</span>
                         </div>
                      ) : user.connectionStatus === 'pending_received' ? (
                         <div className="px-3 py-1.5 rounded-xl bg-primary/10 text-[10px] font-bold text-primary flex items-center gap-1.5 cursor-default">
                            <UserPlus size={12} />
                            <span>Received</span>
                         </div>
                      ) : (
                         <button 
                           onClick={async () => {
                             await sendRequest(user._id);
                             // Optimistically update status in results
                             setResults(prev => prev.map(u => u._id === user._id ? { ...u, connectionStatus: 'pending_sent' } : u));
                           }}
                           className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground transition-all hover:bg-white hover:text-black"
                           title="Add Friend"
                         >
                            <UserPlus size={16} />
                         </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer hint */}
              <div className="p-3 border-t border-white/5 bg-white/1">
                <p className="text-[10px] text-center text-muted-foreground/40 font-mono">
                  Press ESC to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
