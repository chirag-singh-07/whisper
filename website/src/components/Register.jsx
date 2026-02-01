import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { UserPlus, User, Lock, Mail, Info, Loader2, ArrowRight, ArrowLeft, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    setError('');
    if (step === 1) {
       // Step 1 Validation: Name, Username, Email
       if (!formData.name || !formData.username || !formData.email) {
          setError("Please fill in all required fields.");
          return;
       }
       setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Step 2 Validation: Password Matching & Length
    if (formData.password !== formData.confirmPassword) {
       setError("Passwords do not match.");
       return;
    }

    if (formData.password.length < 6) {
       setError("Password must be at least 6 characters.");
       return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
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
                         <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Display Name</label>
                         <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
                            <input 
                               type="text"
                               placeholder="John Doe"
                               className="w-full h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                               value={formData.name}
                               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                               autoFocus
                            />
                         </div>
                      </div>

                      {/* 2. Username */}
                      <div className="space-y-2">
                         <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Username</label>
                         <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold group-focus-within:text-primary transition-colors text-lg">@</div>
                            <input 
                               type="text"
                               placeholder="username"
                               className="w-full h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                               value={formData.username}
                               onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                         </div>
                      </div>

                      {/* 3. Email */}
                      <div className="space-y-2">
                         <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Email</label>
                         <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
                            <input 
                               type="email"
                               placeholder="john@example.com"
                               className="w-full h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                               value={formData.email}
                               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                               className="w-full h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                               value={formData.about}
                               onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                               autoFocus
                            />
                         </div>
                      </div>

                      {/* 2. Password */}
                      <div className="space-y-2">
                         <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Password</label>
                         <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
                            <input 
                               type="password"
                               placeholder="••••••••"
                               className="w-full h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                               value={formData.password}
                               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                         </div>
                      </div>

                      {/* 3. Confirm Password */}
                      <div className="space-y-2">
                         <label className="text-xs uppercase font-bold text-muted-foreground/80 tracking-widest pl-1">Confirm Password</label>
                         <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-5 w-5" />
                            <input 
                               type="password"
                               placeholder="••••••••"
                               className="w-full h-14 pl-12 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                               value={formData.confirmPassword}
                               onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                         </div>
                      </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl font-medium animate-pulse text-center">
                     {error}
                  </div>
               )}

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
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Revolution.</span>
            </h2>
            <div className="space-y-6">
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 text-primary border border-white/5">
                     <ShieldCheck /> 
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Military-Grade Encryption</h3>
                     <p className="text-muted-foreground/80 mt-1">Your messages are encrypted before they even leave your device.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 text-primary border border-white/5">
                     <Zap /> 
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-white">Lightning Fast</h3>
                     <p className="text-muted-foreground/80 mt-1">Built on a distributed network for instant message delivery.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 text-primary border border-white/5">
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
