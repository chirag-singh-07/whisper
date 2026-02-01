import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { UserPlus, User, Lock, Mail, Info, Loader2, ArrowRight, ArrowLeft, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    about: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Display Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
       newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
       newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
     const newErrors = {};
     
     // Password must be at least 8 characters
     if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
     }
     // Must contain uppercase
     else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter";
     }
     // Must contain lowercase
     else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one lowercase letter";
     }
     // Must contain number
     else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
     }
     // Must contain special character
     else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one special character";
     }
     
     if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
     }
     
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
       setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNext = () => {
    if (step === 1) {
       if (validateStep1()) {
          setStep(2);
       } else {
          toast.error("Please fix the errors to continue");
       }
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) {
       toast.error("Please fix the errors to continue");
       return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating your secure identity...");

    try {
      const { confirmPassword, ...payload } = formData;
      const { data: responseBody } = await api.post('/auth/register', payload);
      const { tokens, ...userData } = responseBody.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.dismiss(loadingToast);
      toast.success("Welcome to Whisper!", {
        description: "Your account has been successfully created."
      });
      
      navigate('/chat');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Registration failed', {
        description: "Please check your details and try again."
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
               <div className="relative w-full h-[600px] rounded-[48px] overflow-hidden border border-white/10 bg-linear-to-br from-primary/20 to-secondary/20 shadow-3xl shadow-primary/10">
                  <UserPlus size={24} />
               </div>
               <h1 className="text-4xl font-black text-white tracking-tight mb-3">
                  {step === 1 ? 'Create Identity' : 'Secure Vault'}
               </h1>
               <p className="text-muted-foreground text-lg">
                  {step === 1 ? 'Step 1 of 2: Who are you?' : 'Step 2 of 2: Protect your data.'}
               </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
               <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="space-y-5"
                    >
                      {/* 1. Full Name */}
                      <div className="space-y-2">
                         <div className="flex justify-between">
                            <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Display Name</label>
                            {errors.name && <span className="text-xs text-red-500 font-bold animate-in fade-in">{errors.name}</span>}
                         </div>
                         <div className="relative group">
                            <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors h-5 w-5 ${errors.name ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                            <input 
                               type="text"
                               placeholder="John Doe"
                               aria-invalid={!!errors.name}
                               className={`w-full h-14 pl-12 bg-white/5 border rounded-2xl text-white outline-none transition-all placeholder:text-white/20 ${errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                               value={formData.name}
                               onChange={(e) => {
                                  setFormData({ ...formData, name: e.target.value });
                                  clearError('name');
                               }}
                               autoFocus
                            />
                         </div>
                      </div>

                      {/* 2. Username */}
                      <div className="space-y-2">
                         <div className="flex justify-between">
                            <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Username</label>
                            {errors.username && <span className="text-xs text-red-500 font-bold animate-in fade-in">{errors.username}</span>}
                         </div>
                         <div className="relative group">
                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold transition-colors text-lg ${errors.username ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`}>@</div>
                            <input 
                               type="text"
                               placeholder="username"
                               aria-invalid={!!errors.username}
                               className={`w-full h-14 pl-12 bg-white/5 border rounded-2xl text-white outline-none transition-all placeholder:text-white/20 ${errors.username ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                               value={formData.username}
                               onChange={(e) => {
                                  setFormData({ ...formData, username: e.target.value });
                                  clearError('username');
                               }}
                            />
                         </div>
                      </div>

                      {/* 3. Email */}
                      <div className="space-y-2">
                         <div className="flex justify-between">
                            <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Email</label>
                            {errors.email && <span className="text-xs text-red-500 font-bold animate-in fade-in">{errors.email}</span>}
                         </div>
                         <div className="relative group">
                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors h-5 w-5 ${errors.email ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`} />
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
                            />
                         </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="space-y-5"
                    >
                       {/* 1. About */}
                       <div className="space-y-2">
                         <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">About (Optional)</label>
                         <div className="relative group">
                            <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
                            <input 
                               type="text"
                               placeholder="I love encrypted chats"
                               className="w-full h-14 pl-12 bg-white/2 border border-white/5 rounded-2xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                               value={formData.about}
                               onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                               autoFocus
                            />
                         </div>
                      </div>

                      {/* 2. Password */}
                      <div className="space-y-2">
                         <div className="flex justify-between">
                            <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Password</label>
                            {errors.password && <span className="text-xs text-red-500 font-bold animate-in fade-in">{errors.password}</span>}
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

                      {/* 3. Confirm Password */}
                      <div className="space-y-2">
                         <div className="flex justify-between">
                            <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Confirm Password</label>
                            {errors.confirmPassword && <span className="text-xs text-red-500 font-bold animate-in fade-in">{errors.confirmPassword}</span>}
                         </div>
                         <div className="relative group">
                            <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors h-5 w-5 ${errors.confirmPassword ? 'text-red-500' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                            <input 
                               type="password"
                               placeholder="••••••••"
                               aria-invalid={!!errors.confirmPassword}
                               className={`w-full h-14 pl-12 bg-white/5 border rounded-2xl text-white outline-none transition-all placeholder:text-white/20 ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-white/10 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                               value={formData.confirmPassword}
                               onChange={(e) => {
                                  setFormData({ ...formData, confirmPassword: e.target.value });
                                  clearError('confirmPassword');
                               }}
                            />
                         </div>
                      </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               {/* Action Buttons */}
               <div className="pt-4">
                  {step === 1 ? (
                     <Button type="button" onClick={handleNext} className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-transform hover:scale-[1.02] shadow-xl shadow-primary/20">
                        Continue <ArrowRight className="ml-2" />
                     </Button>
                  ) : (
                     <div className="flex gap-4">
                        <Button type="button" variant="ghost" onClick={handleBack} className="h-14 w-20 rounded-2xl border border-white/10 hover:bg-white/5 text-muted-foreground">
                           <ArrowLeft />
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 h-14 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-transform hover:scale-[1.02] shadow-xl shadow-primary/20">
                           {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create Account'}
                        </Button>
                     </div>
                  )}
               </div>
            </form>

            <div className="mt-8 text-center">
               <p className="text-muted-foreground">
                  Already a member? 
                  <Link to="/login" className="text-primary font-bold ml-2 hover:underline">Sign In</Link>
               </p>
            </div>
         </div>
      </div>

      {/* RIGHT SIDE: Visual Area */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] relative overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
         
         {/* Animated Background Blobs */}
         <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px]" 
         />
         <motion.div 
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]" 
         />

         {/* Content */}
         <div className="relative z-10 p-12 max-w-lg">
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
               Join the <br/>
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-400">Revolution.</span>
            </h2>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 text-primary border border-white/5">
                     <ShieldCheck /> 
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Military-Grade Encryption</h3>
                     <p className="text-muted-foreground/80 mt-1">Your messages are encrypted before they even leave your device.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 text-primary border border-white/5">
                     <Zap /> 
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Lightning Fast</h3>
                     <p className="text-muted-foreground/80 mt-1">Built on a distributed network for instant message delivery.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 text-primary border border-white/5">
                     <Globe /> 
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Truly Anonymous</h3>
                     <p className="text-muted-foreground/80 mt-1">No phone number. No email verification. Just you and your keys.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
