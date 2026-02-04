import React from 'react';
import { Check, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function RequestsList({ requests, acceptRequest, rejectRequest, getAvatar }) {
  if (requests.length === 0) {
     return (
        <div className="p-8 text-center">
           <p className="text-xs text-muted-foreground font-medium">No pending requests</p>
        </div>
     );
  }

  return (
    <div className="space-y-2 p-2">
       {requests.map(req => (
          <div key={req._id} className="bg-white/5 p-3 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
             <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-white/5 rounded-xl">
                   <AvatarImage src={getAvatar(req.sender?.avatarUrl)} className="object-cover" />
                   <AvatarFallback className="bg-secondary text-muted-foreground font-bold rounded-xl">
                      {req.sender?.name?.charAt(0)}
                   </AvatarFallback>
                </Avatar>
                <div>
                   <h4 className="text-sm font-bold text-white leading-none mb-1">{req.sender?.name}</h4>
                   <p className="text-[10px] text-muted-foreground">sent a request</p>
                </div>
             </div>
             
             <div className="flex items-center gap-1">
                <button 
                  onClick={() => acceptRequest(req._id)}
                  className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                  title="Accept"
                >
                   <Check size={14} strokeWidth={3} />
                </button>
                <button 
                  onClick={() => rejectRequest(req._id)}
                  className="w-8 h-8 rounded-xl bg-white/5 text-muted-foreground flex items-center justify-center hover:bg-destructive hover:text-white transition-all"
                  title="Reject"
                >
                   <X size={14} strokeWidth={3} />
                </button>
             </div>
          </div>
       ))}
    </div>
  );
}
