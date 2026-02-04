import React, { useState } from 'react';
import { Search, Settings, Loader2, ChevronRight, MessageSquare, Plus, Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import NewChatDialog from './NewChatDialog';
import RequestsList from './RequestsList';
import { useRequests } from '../../hooks/useRequests';

export default function Sidebar({ 
  user, 
  chats, 
  chatsLoading, 
  activeChat, 
  setActiveChat, 
  searchQuery, 
  setSearchQuery, 
  searchResults, 
  searching, 
  startChat, 
  getAvatar 
}) {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [view, setView] = useState('chats'); // 'chats' | 'requests'
  const { requests, acceptRequest, rejectRequest } = useRequests();

  return (
    <aside className="w-80 md:w-[400px] border-r border-white/5 flex flex-col bg-[#111113]/50 backdrop-blur-3xl relative z-20">
      {/* Sidebar Header */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-8">
           {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src="/logo.png" alt="Whisper Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Whisper</h1>
          </div>
          
          <div className="flex items-center gap-2">
             <Button 
               onClick={() => setIsNewChatOpen(true)}
               variant="ghost" 
               size="icon" 
               className="h-9 w-9 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors"
             >
               <Plus size={18} />
             </Button>
             <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5">
               <Settings size={18} className="text-muted-foreground" />
             </Button>
             <Avatar className="h-10 w-10 border border-white/10 ring-4 ring-black">
               <AvatarImage src={getAvatar(user.avatarUrl)} />
               <AvatarFallback className="bg-primary/10 text-primary font-bold">
                 {user.name?.charAt(0)}
               </AvatarFallback>
             </Avatar>
          </div>
        </div>

        <div className="relative group mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-[#1A1A1C] border border-white/5 h-11 pl-11 rounded-2xl focus:border-primary/40 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/40 transition-all text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* View Toggles */}
        <div className="flex p-1 bg-white/5 rounded-xl mb-2">
           <button 
             onClick={() => setView('chats')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${view === 'chats' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
           >
              <MessageCircle size={14} />
              Chats
           </button>
           <button 
             onClick={() => setView('requests')}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all relative ${view === 'requests' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-white'}`}
           >
              <Users size={14} />
              Requests
              {requests.length > 0 && (
                 <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#111113]" />
              )}
           </button>
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 pb-6">
          {searchQuery.trim() ? (
            <div className="animate-in fade-in slide-in-from-top-1 duration-300">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 px-3">Global Discovery</h2>
              {searching ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="animate-spin text-primary/50" size={24} />
                </div>
              ) : (
                searchResults.map(u => (
                  <button 
                    key={u._id}
                    onClick={() => startChat(u)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all group group"
                  >
                    <Avatar className="h-12 w-12 rounded-2xl border border-white/5">
                      <AvatarImage src={getAvatar(u.avatarUrl)} className="object-cover" />
                      <AvatarFallback className="bg-secondary text-muted-foreground font-bold">
                        {u.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold tracking-wider">@{u.username}</p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))
              )}
            </div>
          ) : view === 'requests' ? (
             <RequestsList 
               requests={requests} 
               acceptRequest={acceptRequest} 
               rejectRequest={rejectRequest}
               getAvatar={getAvatar}
             />
          ) : (
            <>
              <div className="flex items-center justify-between mb-3 px-3">
                <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Messages</h2>
                <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
                  {chats.length} Active
                </span>
              </div>
              {chatsLoading && chats.length === 0 ? (
                <div className="space-y-2 px-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-20 bg-white/2 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                 chats.map(chat => {
                   const isActive = activeChat?._id === chat._id;
                   return (
                      <button
                        key={chat._id}
                        onClick={() => setActiveChat(chat)}
                        className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all relative group mb-1 ${isActive ? 'bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5' : 'hover:bg-white/3 border border-transparent'}`}
                      >
                        <div className="relative">
                          <Avatar className="h-14 w-14 rounded-2xl border border-white/5 shadow-xl">
                            <AvatarImage src={getAvatar(chat.participants.avatarUrl)} className="object-cover" />
                            <AvatarFallback className="bg-secondary text-primary font-black text-lg">
                              {chat.participants.name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#111113] p-0.5">
                            <div className="w-full h-full rounded-full bg-success" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex justify-between items-center mb-1">
                            <p className={`font-bold truncate text-[15px] ${isActive ? 'text-primary' : 'text-white group-hover:text-primary transition-colors'}`}>
                              {chat.participants.name}
                            </p>
                            <span className="text-[10px] font-bold text-muted-foreground/50 tabular-nums">
                              {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs truncate font-medium opacity-80">
                            {chat.lastMessage?.text || 'No messages yet'}
                          </p>
                        </div>
                        {chat.unreadCount > 0 && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                             <span className="text-[9px] font-black text-white">{chat.unreadCount}</span>
                          </div>
                        )}
                      </button>
                   );
                 })
              )}
            </>
          )}
        </div>
      </ScrollArea>

      <NewChatDialog 
        isOpen={isNewChatOpen} 
        onClose={() => setIsNewChatOpen(false)} 
        startChat={startChat}
        getAvatar={getAvatar}
      />
    </aside>
  );
}
