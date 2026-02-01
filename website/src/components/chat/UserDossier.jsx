import React from 'react';
import { motion } from 'framer-motion';
import { X, Phone, Video, Share2, Shield, Bell, Ban, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function UserDossier({ 
  activeChat, 
  getAvatar, 
  setShowDetails 
}) {
  return (
    <motion.aside 
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 360, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="border-l border-white/5 bg-[#0D0D0E] flex flex-col relative z-20 overflow-hidden"
    >
      <div className="w-[360px] flex flex-col h-full">
         {/* Detail Header */}
         <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Intelligence</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)} className="h-8 w-8 rounded-lg hover:bg-white/5">
              <X size={18} />
            </Button>
         </div>

         <ScrollArea className="flex-1">
            <div className="p-8 text-center border-b border-white/5 pb-12">
               <div className="relative inline-block mb-6">
                  <Avatar className="h-32 w-32 rounded-[40px] border-4 border-white/5 shadow-2xl">
                    <AvatarImage src={getAvatar(activeChat.participants.avatarUrl)} className="object-cover" />
                    <AvatarFallback className="bg-primary/20 text-primary font-black text-4xl">
                      {activeChat.participants.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl bg-success border-4 border-[#0D0D0E] shadow-lg shadow-success/20" />
               </div>
               <h2 className="text-2xl font-black text-white mb-2">{activeChat.participants.name}</h2>
               <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-6">@{activeChat.participants.username}</p>
               
               <div className="flex justify-center gap-3">
                  <Button variant="secondary" className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 p-0">
                     <Phone size={20} className="text-white/60" />
                  </Button>
                  <Button variant="secondary" className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 p-0">
                     <Video size={20} className="text-white/60" />
                  </Button>
                  <Button variant="secondary" className="h-12 w-12 rounded-2xl bg-white/5 hover:bg-white/10 p-0">
                     <Share2 size={20} className="text-white/60" />
                  </Button>
               </div>
            </div>

            {/* About Section */}
            <div className="p-8 border-b border-white/5 space-y-6">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 opacity-50">Operational Dossier</h4>
                  <p className="text-[14px] leading-relaxed text-white/80 font-medium italic">
                     {activeChat.participants.about || "This user prefers to keep their profile confidential. No additional data available."}
                  </p>
               </div>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <Shield size={14} className="text-success" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[11px] font-bold text-white">Trust Level</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">Verified Operative</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bell size={14} className="text-primary" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[11px] font-bold text-white">Notifications</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">Standard Alerts Active</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Section */}
            <div className="p-8 pt-6 space-y-3 pb-20">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 opacity-50">Risk Management</h4>
               <Button variant="ghost" className="w-full justify-start h-12 rounded-2xl text-red-400 hover:text-red-500 hover:bg-red-500/5 gap-3 font-bold text-xs uppercase tracking-wider">
                  <Ban size={18} /> Block User
               </Button>
               <Button variant="ghost" className="w-full justify-start h-12 rounded-2xl text-muted-foreground hover:text-red-400 hover:bg-red-500/5 gap-3 font-bold text-xs uppercase tracking-wider">
                  <Trash2 size={18} /> Clear Protocol
               </Button>
            </div>
         </ScrollArea>
      </div>
    </motion.aside>
  );
}
