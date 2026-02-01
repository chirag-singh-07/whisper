import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { LogIn, User, Lock, Loader2, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Required";
    if (!formData.password) newErrors.password = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
       setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
       toast.error("Please fill in all fields");
       return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Accessing encrypted vault...");
    
    // Create log array to store all debug info
    const debugLogs = [];
    const logAndStore = (message, data = null) => {
      const logEntry = data ? `${message} ${JSON.stringify(data, null, 2)}` : message;
      console.log(message, data || '');
      debugLogs.push(logEntry);
    };

    try {
      const { data: responseBody } = await api.post('/auth/login', formData);
      logAndStore('🔍 Full response:', responseBody);
      logAndStore('🔍 Response data:', responseBody.data);
      
      const { tokens, ...userData } = responseBody.data;
      logAndStore('🔍 Extracted tokens:', tokens);
      logAndStore('🔍 Extracted userData:', userData);
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      logAndStore('✅ Stored accessToken:', localStorage.getItem('accessToken'));
      logAndStore('✅ Stored user:', localStorage.getItem('user'));
      
      // Write logs to file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const logContent = `Login Success - ${timestamp}\n${'='.repeat(50)}\n\n${debugLogs.join('\n\n')}\n`;
      
      // Download logs as file
      const blob = new Blob([logContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `login_success_${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.dismiss(loadingToast);
      toast.success("Welcome back!", {
         description: "Secure connection established."
      });
      
      navigate('/chat');
    } catch (err) {
      // Log error details
      debugLogs.push(`❌ Error occurred: ${err.message}`);
      debugLogs.push(`❌ Response status: ${err.response?.status}`);
      debugLogs.push(`❌ Response data: ${JSON.stringify(err.response?.data, null, 2)}`);
      
      // Write error logs to file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const logContent = `Login Error - ${timestamp}\n${'='.repeat(50)}\n\n${debugLogs.join('\n\n')}\n`;
      
      const blob = new Blob([logContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `login_error_${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.dismiss(loadingToast);
      const errorMessage = err.response?.data?.message || 'Login failed';
      
      toast.error(errorMessage, {
         description: err.response?.status === 401 ? "Invalid credentials. Please try again." : "Server isn't responding."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* LEFT SIDE: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative z-10">
         <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-12">
               <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 text-primary shadow-lg shadow-primary/10">
                  <LogIn size={24} />
               </div>
               <h1 className="text-4xl font-black text-white tracking-tight mb-3">
                  Welcome Back
               </h1>
               <p className="text-muted-foreground text-lg">
                  Enter your credentials to access your vault.
               </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Email */}
                <div className="space-y-2">
                   <div className="flex justify-between">
                     <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Email</label>
                     {errors.email && <span className="text-xs text-red-500 font-bold animate-in fade-in">{errors.email}</span>}
                   </div>
                   <div className="relative group">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors h-5 w-5 ${errors.email ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                      <input 
                         type="email"
                         placeholder="john@example.com"
                         aria-invalid={!!errors.email}
                         className={`w-full h-14 pl-12 bg-white/5 border rounded-2xl text-white outline-none transition-all placeholder:text-white/20 ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                         value={formData.email}
                         onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            clearError('email');
                         }}
                         autoFocus
                      />
                   </div>
                </div>

                {/* 2. Password */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest">Password</label>
                      <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
                   </div>
                   <div className="relative group">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors h-5 w-5 ${errors.password ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                      <input 
                         type="password"
                         placeholder="••••••••"
                         aria-invalid={!!errors.password}
                         className={`w-full h-14 pl-12 bg-white/5 border rounded-2xl text-white outline-none transition-all placeholder:text-white/20 ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                         value={formData.password}
                         onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value });
                            clearError('password');
                         }}
                      />
                   </div>
                </div>

               {/* Submit Button */}
               <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-transform hover:scale-[1.02] shadow-xl shadow-primary/20 mt-4">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : 'Sign In'}
               </Button>
            </form>

            <div className="mt-8 text-center">
               <p className="text-muted-foreground">
                  New to Whisper? 
                  <Link to="/register" className="text-primary font-bold ml-2 hover:underline">Create Account</Link>
               </p>
            </div>
         </div>
      </div>

      {/* RIGHT SIDE: Visual Area */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] relative overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
         
         {/* Animated Background Blobs */}
         <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" 
         />
         <motion.div 
            animate={{ scale: [1, 1.5, 1], rotate: [0, 60, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" 
         />

         {/* Content */}
         <div className="relative z-10 p-12 max-w-lg text-center">
             <div className="mb-12 relative inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <div className="relative w-24 h-24 bg-gradient-to-tr from-primary to-orange-400 rounded-3xl flex items-center justify-center shadow-2xl mx-auto rotate-3">
                   <ShieldCheck size={48} className="text-white" />
                </div>
             </div>

            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
               Privacy is <span className="text-primary">Power.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
               "Arguing that you don't care about the right to privacy because you have nothing to hide is no different than saying you don't care about free speech because you have nothing to say."
            </p>
            <p className="text-white/40 font-bold mt-4 text-sm font-mono">– Edward Snowden</p>
         </div>
      </div>
    </div>
  );
}
