import React, { useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Video,
  Info,
  Loader2,
  Plus,
  Shield,
  Smile,
  Send,
  ArrowRight,
  Image,
  FileText,
  X,
  Camera,
  Headphones,
  User,
  BarChart2,
  Calendar,
  Sticker,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

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
  messagesEndRef,
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

    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    return () => {
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
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

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };
  }, [socket, activeChat]);

  // Send typing indicator
  const handleTypingEvent = () => {
    if (!socket || !activeChat) return;

    socket.emit("typing", { chatId: activeChat._id, isTyping: true });

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      socket.emit("typing", { chatId: activeChat._id, isTyping: false });
    }, 2000);

    setTypingTimeout(timeout);
  };

  const imageInputRef = React.useRef(null);
  const docInputRef = React.useRef(null);
  const cameraInputRef = React.useRef(null);
  const audioInputRef = React.useRef(null);
  const [uploading, setUploading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setMessageText((prev) => prev + emojiData.emoji);
    // Optional: setShowEmojiPicker(false); // Prefer keeping open for multiple
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setShowAttachMenu(false); // Close menu on selection

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("accessToken");
      const endpoint = import.meta.env.VITE_API_URL + "/api/upload"; // Corrected endpoint

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const type = file.type.startsWith("image/") ? "image" : "file";

        if (activeChat && socket) {
          const messageData = {
            chatId: activeChat._id,
            type: type,
            text: file.name,
            mediaUrl: data.data.url,
            mediaMeta: {
              size: data.data.size,
              mimeType: data.data.mimetype,
            },
          };

          socket.emit("send_message", messageData);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
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
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight italic uppercase">
              Whisper <span className="text-primary italic">Live</span>
            </h2>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed text-lg font-medium opacity-80 mb-10">
              Unlock the vault. Send secure, encrypted messages to your contacts
              in real-time.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-3xl bg-white/2 border border-white/5">
                <Shield size={20} className="text-primary mx-auto mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Encrypted
                </p>
              </div>
              <div className="p-4 rounded-3xl bg-white/2 border border-white/5">
                <Plus size={20} className="text-primary mx-auto mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Fast Sync
                </p>
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
                <AvatarImage
                  src={getAvatar(activeChat.participants.avatarUrl)}
                  className="object-cover"
                />
                <AvatarFallback className="bg-secondary text-primary font-bold">
                  {activeChat.participants.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-[#0A0A0B] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              )}
            </div>
            <div>
              <h3 className="text-white font-bold leading-tight">
                {activeChat.participants.name}
              </h3>
              <div className="flex items-center gap-1.5 opacity-70">
                {isTyping ? (
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary animate-pulse">
                    Typing...
                  </span>
                ) : isOnline ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-success">
                      Active Now
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                    Offline
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl"
            >
              <Phone size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl"
            >
              <Video size={20} />
            </Button>
            <div className="w-px h-6 bg-white/5 mx-2" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDetails(!showDetails)}
              className={`h-10 w-10 rounded-2xl transition-all ${showDetails ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
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
                <p className="text-xs font-black uppercase tracking-widest italic">
                  Decrypting...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 opacity-30 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Plus size={32} className="text-primary" />
                </div>
                <p className="text-lg font-bold text-white mb-2">
                  No transmissions yet
                </p>
                <p className="text-sm max-w-xs leading-relaxed">
                  Safety first. Your messages are end-to-end encrypted and
                  visible only to you.
                </p>
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
                      className={`flex gap-3 group ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && (
                        <Avatar className="h-8 w-8 rounded-xl border border-white/10 shadow-lg mt-1 flex-shrink-0">
                          <AvatarImage
                            src={getAvatar(activeChat.participants.avatarUrl)}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-secondary text-primary font-bold text-xs">
                            {activeChat.participants.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[calc(100%-3rem)] sm:max-w-[70%] min-w-0`}
                      >
                        <div
                          className={`px-5 py-4 rounded-[26px] shadow-2xl ${isMe ? "bg-primary text-white rounded-br-none shadow-primary/10" : "bg-[#1A1A1C] border border-white/5 text-white rounded-bl-none shadow-black/50"} overflow-hidden`}
                        >
                          {m.type === "image" ? (
                            <div className="rounded-xl overflow-hidden mb-1">
                              <img
                                src={import.meta.env.VITE_API_URL + m.mediaUrl}
                                alt="Shared image"
                                className="max-w-full h-auto max-h-[300px] object-cover"
                                loading="lazy"
                              />
                            </div>
                          ) : m.type === "file" ? (
                            <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl mb-1">
                              <div className="p-2 bg-white/10 rounded-lg">
                                <Plus size={20} className="text-white" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate">
                                  {m.text || "File Attachment"}
                                </p>
                                <p className="text-xs opacity-70">
                                  {(m.mediaMeta?.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <a
                                href={import.meta.env.VITE_API_URL + m.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <ArrowRight size={16} />
                              </a>
                            </div>
                          ) : null}

                          {m.text && m.type !== "image" && (
                            <p className="text-[15px] leading-relaxed font-medium font-emoji selection:bg-black/20 break-words whitespace-pre-wrap">
                              {m.text}
                            </p>
                          )}

                          {/* Caption for images if exists (optional, reusing text field) */}
                          {m.type === "image" &&
                            m.text &&
                            m.text !== "Image" && (
                              <p className="text-sm mt-1">{m.text}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground/60">
                            {new Date(m.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isMe && (
                            <Shield
                              size={10}
                              className="text-primary opacity-50"
                            />
                          )}
                        </div>
                      </div>
                      {isMe && (
                        <Avatar className="h-8 w-8 rounded-xl border border-white/10 shadow-lg mt-1 flex-shrink-0">
                          <AvatarImage
                            src={getAvatar(user.avatarUrl)}
                            className="object-cover"
                          />
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
                        <AvatarImage
                          src={getAvatar(activeChat.participants.avatarUrl)}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-secondary text-primary font-bold text-xs">
                          {activeChat.participants.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="px-5 py-4 rounded-[26px] bg-[#1A1A1C] border border-white/5 shadow-2xl rounded-bl-none">
                        <div className="flex gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
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
              {/* Attachment Menu */}
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-16 left-0 bg-[#232325] border border-white/5 p-2 rounded-2xl shadow-2xl grid grid-cols-1 min-w-[220px] z-50 overflow-hidden pb-1"
                  >
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group/btn"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/btn:bg-indigo-500 group-hover/btn:text-white transition-all">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-bold text-white mb-0.5">
                        Document
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group/btn"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover/btn:bg-blue-500 group-hover/btn:text-white transition-all">
                        <Image size={16} />
                      </div>
                      <span className="text-sm font-bold text-white mb-0.5">
                        Photos & videos
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group/btn"
                    >
                      <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover/btn:bg-pink-500 group-hover/btn:text-white transition-all">
                        <Camera size={16} />
                      </div>
                      <span className="text-sm font-bold text-white mb-0.5">
                        Camera
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group/btn"
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover/btn:bg-orange-500 group-hover/btn:text-white transition-all">
                        <Headphones size={16} />
                      </div>
                      <span className="text-sm font-bold text-white mb-0.5">
                        Audio
                      </span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group/btn opacity-50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover/btn:bg-sky-500 group-hover/btn:text-white transition-all">
                        <User size={16} />
                      </div>
                      <span className="text-sm font-bold text-white mb-0.5">
                        Contact
                      </span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group/btn opacity-50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover/btn:bg-yellow-500 group-hover/btn:text-white transition-all">
                        <BarChart2 size={16} />
                      </div>
                      <span className="text-sm font-bold text-white mb-0.5">
                        Poll
                      </span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group/btn opacity-50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover/btn:bg-rose-500 group-hover/btn:text-white transition-all">
                        <Calendar size={16} />
                      </div>
                      <span className="text-sm font-bold text-white mb-0.5">
                        Event
                      </span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-3 w-full p-2.5 hover:bg-white/5 rounded-xl transition-colors text-left group/btn opacity-50 cursor-not-allowed"
                      title="Coming soon"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover/btn:bg-emerald-500 group-hover/btn:text-white transition-all">
                        <Sticker size={16} />
                      </div>
                      <span className="text-sm font-bold text-white mb-0.5">
                        New sticker
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,video/*"
              />
              <input
                type="file"
                ref={docInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              />
              <input
                type="file"
                ref={cameraInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*"
                capture="environment"
              />
              <input
                type="file"
                ref={audioInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="audio/*"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                disabled={uploading}
                className={`h-11 w-11 rounded-2xl transition-all self-center ${showAttachMenu ? "text-white bg-white/10 rotate-45" : "text-muted-foreground hover:text-primary opacity-60 hover:opacity-100"}`}
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <Plus size={22} />
                )}
              </Button>

              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bottom-16 right-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10"
                  >
                    <EmojiPicker
                      theme="dark"
                      onEmojiClick={onEmojiClick}
                      autoFocusSearch={false}
                      width={320}
                      height={400}
                      previewConfig={{ showPreview: false }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                rows="1"
                placeholder="Whisper something secure..."
                className="flex-1 bg-transparent text-white resize-none text-[15px] font-medium font-emoji max-h-48 py-3.5 outline-none placeholder:text-muted-foreground/30 scrollbar-hide"
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value);
                  handleTypingEvent();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                onClick={() => {
                  setShowAttachMenu(false);
                  setShowEmojiPicker(false);
                }}
              />

              <div className="flex items-center gap-1.5 pb-1">
                <Button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  variant="ghost"
                  size="icon"
                  className={`h-10 w-10 transition-all ${showEmojiPicker ? "text-primary opacity-100" : "text-muted-foreground hover:text-primary opacity-60 hover:opacity-100"}`}
                >
                  <Smile size={20} />
                </Button>
                <Button
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  className={`h-11 w-11 rounded-2xl shadow-xl shadow-primary/20 p-0 transition-all ${messageText.trim() ? "bg-primary scale-100" : "bg-muted/10 scale-95 opacity-50"}`}
                >
                  {sending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} className="translate-x-0.5" />
                  )}
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
