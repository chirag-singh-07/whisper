import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, Info, Loader2, Plus, Shield, Smile, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';


export default function ChatArea({ 
  activeChat, 
  messages, 
  msgsLoading, 
  user, 
  getAvatar, 
  showDetails, 
  setShowDetails, 
  messageText, 
  setMessageText, 
  handleSend, 
  sending, 
  messagesEndRef 
}) {
  const socket = useSocket();
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Track online status
  useEffect(() => {
    if (!socket || !activeChat) return;

    // Set initial status
    setIsOnline(activeChat.participants.isOnline || false);

    const handleUserOnline = ({ userId }) => {
      if (userId === activeChat.participants._id) {
        setIsOnline(true);
      }
    };

    const handleUserOffline = ({ userId }) => {
      if (userId === activeChat.participants._id) {
        setIsOnline(false);
      }
    };

    socket.on('user:online', handleUserOnline);
    socket.on('user:offline', handleUserOffline);

    return () => {
      socket.off('user:online', handleUserOnline);
      socket.off('user:offline', handleUserOffline);
    };
  }, [socket, activeChat]);

  // Track typing indicator
  useEffect(() => {
    if (!socket || !activeChat) return;

    const handleTyping = ({ chatId, userId, isTyping: typing }) => {
      if (chatId === activeChat._id && userId === activeChat.participants._id) {
        setIsTyping(typing);
      }
    };

    socket.on('typing', handleTyping);

    return () => {
      socket.off('typing', handleTyping);
    };
  }, [socket, activeChat]);

  // Send typing indicator
  const handleTypingEvent = () => {
    if (!socket || !activeChat) return;

    socket.emit('typing', { chatId: activeChat._id, isTyping: true });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit('typing', { chatId: activeChat._id, isTyping: false });
    }, 2000);

    setTypingTimeout(timeout);
  };

  if (!activeChat) {
    return (
      <main className="flex-1 flex flex-col relative bg-[#0A0A0B]">
        <div className="h-full flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full opacity-20" />
          
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative mb-12"
          >
            <div className="w-32 h-32 bg-white/3 border border-white/10 rounded-[48px] flex items-center justify-center shadow-3xl rotate-3">
              <MessageSquare size={54} className="text-primary/40 -rotate-3" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30 animate-bounce cursor-default">
               <Plus size={24} className="text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight italic uppercase">Whisper <span className="text-primary italic">Live</span></h2>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed text-lg font-medium opacity-80 mb-10">
              Unlock the vault. Send secure, encrypted messages to your contacts in real-time.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
               <div className="p-4 rounded-3xl bg-white/2 border border-white/5">
                  <Shield size={20} className="text-primary mx-auto mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Encrypted</p>
               </div>
               <div className="p-4 rounded-3xl bg-white/2 border border-white/5">
                  <Plus size={20} className="text-primary mx-auto mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Fast Sync</p>
               </div>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col relative bg-[#0A0A0B]">
      <div className="h-full flex flex-col animate-in fade-in duration-500">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0B]/80 backdrop-blur-xl z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-11 w-11 rounded-1.5xl border border-white/10 shadow-lg">
                <AvatarImage src={getAvatar(activeChat.participants.avatarUrl)} className="object-cover" />
                <AvatarFallback className="bg-secondary text-primary font-bold">
                  {activeChat.participants.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-[#0A0A0B] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold leading-tight">{activeChat.participants.name}</h3>
              <div className="flex items-center gap-1.5 opacity-70">
                {isTyping ? (
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary animate-pulse">Typing...</span>
                ) : isOnline ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-success">Active Now</span>
                  </>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Offline</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl">
              <Phone size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl">
              <Video size={20} />
            </Button>
            <div className="w-px h-6 bg-white/5 mx-2" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowDetails(!showDetails)}
              className={`h-10 w-10 rounded-2xl transition-all ${showDetails ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}
            >
              <Info size={20} />
            </Button>
          </div>
        </header>

        {/* Messages Scroll Area */}
        <ScrollArea className="flex-1 p-8 px-4 md:px-12 overflow-x-hidden">
          <div className="space-y-8 max-w-5xl mx-auto pb-8 w-full">
            {msgsLoading ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-20">
                <Loader2 className="animate-spin text-primary mb-4" size={40} />
                <p className="text-xs font-black uppercase tracking-widest italic">Decrypting...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-30 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                   <Plus size={32} className="text-primary" />
                </div>
                <p className="text-lg font-bold text-white mb-2">No transmissions yet</p>
                <p className="text-sm max-w-xs leading-relaxed">Safety first. Your messages are end-to-end encrypted and visible only to you.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-12">
                   <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-white/5">
                      Signal Established
                   </span>
                </div>
                {messages.map((m) => {
                  const isMe = m.sender._id === user.id;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      key={m._id}
                      className={`flex gap-3 group ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isMe && (
                        <Avatar className="h-8 w-8 rounded-xl border border-white/10 shadow-lg mt-1 flex-shrink-0">
                          <AvatarImage src={getAvatar(activeChat.participants.avatarUrl)} className="object-cover" />
                          <AvatarFallback className="bg-secondary text-primary font-bold text-xs">
                            {activeChat.participants.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[calc(100%-3rem)] sm:max-w-[70%] min-w-0 flex-1`}>
                        <div className={`px-5 py-4 rounded-[26px] shadow-2xl w-full ${isMe ? 'bg-primary text-white rounded-br-none shadow-primary/10' : 'bg-[#1A1A1C] border border-white/5 text-white rounded-bl-none shadow-black/50'}`}>
                          <p className="text-[15px] leading-relaxed font-medium selection:bg-black/20 break-words whitespace-pre-wrap">{m.text}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground/60">
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMe && <Shield size={10} className="text-primary opacity-50" />}
                        </div>
                      </div>
                      {isMe && (
                        <Avatar className="h-8 w-8 rounded-xl border border-white/10 shadow-lg mt-1 flex-shrink-0">
                          <AvatarImage src={getAvatar(user.avatarUrl)} className="object-cover" />
                          <AvatarFallback className="bg-primary text-white font-bold text-xs">
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  );
                })}
                
                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-3 justify-start"
                    >
                      <Avatar className="h-8 w-8 rounded-xl border border-white/10 shadow-lg mt-1">
                        <AvatarImage src={getAvatar(activeChat.participants.avatarUrl)} className="object-cover" />
                        <AvatarFallback className="bg-secondary text-primary font-bold text-xs">
                          {activeChat.participants.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="px-5 py-4 rounded-[26px] bg-[#1A1A1C] border border-white/5 shadow-2xl rounded-bl-none">
                        <div className="flex gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div ref={messagesEndRef} className="h-4" />
              </>
            )}
          </div>
        </ScrollArea>

        {/* Input Container */}
        <div className="p-8 pt-0">
          <div className="max-w-5xl mx-auto">
            <form 
               onSubmit={handleSend} 
               className="relative flex items-end gap-3 bg-[#111113]/80 border border-white/10 p-2.5 pl-4 rounded-[30px] shadow-2xl backdrop-blur-2xl focus-within:border-primary/30 transition-all group"
            >
              <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-2xl text-muted-foreground hover:text-primary transition-all self-center opacity-60 hover:opacity-100">
                <Plus size={22} />
              </Button>
              
              <textarea
                rows="1"
                placeholder="Whisper something secure..."
                className="flex-1 bg-transparent text-white resize-none text-[15px] font-medium max-h-48 py-3.5 outline-none placeholder:text-muted-foreground/30 scrollbar-hide"
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  handleTypingEvent();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              
              <div className="flex items-center gap-1.5 pb-1">
                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary transition-all opacity-60 hover:opacity-100">
                  <Smile size={20} />
                </Button>
                <Button 
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  className={`h-11 w-11 rounded-2xl shadow-xl shadow-primary/20 p-0 transition-all ${messageText.trim() ? 'bg-primary scale-100' : 'bg-muted/10 scale-95 opacity-50'}`}
                >
                  {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="translate-x-0.5" />}
                </Button>
              </div>
            </form>
            <div className="flex justify-center mt-3">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 flex items-center gap-2">
                <Shield size={10} /> Fully Encrypted Signal Path
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
