import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const LoadingScreen = ({ message = "Establishing Secure Connection..." }) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#050505] overflow-hidden">
      {/* Dynamic Background Effects */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"
      />
      
      <div className="relative flex flex-col items-center">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="relative w-24 h-24 bg-linear-to-tr from-primary to-orange-400 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
            <ShieldCheck size={48} className="text-white" />
          </div>
          
          {/* Spinning Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-primary/20 border-t-primary rounded-[32px]"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-2">
            Whisper
          </h1>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]"
            />
            <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
              {message}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Noise Overaly */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
    </div>
  );
};

export default LoadingScreen;
