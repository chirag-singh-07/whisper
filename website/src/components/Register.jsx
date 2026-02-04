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

  const InputField = ({ label, error, icon: Icon, ...props }) => (
     <div className="space-y-2">
        <div className="flex justify-between items-center bg-transparent">
           <label className="text-[11px] uppercase font-bold text-muted-foreground/60 tracking-[0.2em] pl-1 transition-colors hover:text-muted-foreground cursor-pointer">{label}</label>
           {error && <span className="text-[11px] text-destructive font-bold animate-in slide-in-from-right-2 fade-in">{error}</span>}
        </div>
        <div className="relative group">
           <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-destructive' : 'text-muted-foreground/50 group-focus-within:text-primary group-hover:text-muted-foreground'}`}>
              <Icon size={18} />
           </div>
           <input 
              {...props}
              className={`w-full h-14 pl-12 bg-white/[0.03] border backdrop-blur-sm rounded-2xl text-white outline-none transition-all duration-300 placeholder:text-white/10
                 ${error 
                    ? 'border-destructive/50 focus:border-destructive focus:ring-4 focus:ring-destructive/10' 
                    : 'border-white/5 hover:border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:bg-white/[0.06]'
                 }`}
           />
           <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
        </div>
     </div>
  );

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground selection:bg-primary/30">
      {/* LEFT SIDE: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 relative z-10">
         
         {/* Background Decor */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
         </div>

         <div className="max-w-[440px] w-full mx-auto">
            {/* Header */}
            <div className="mb-10 animate-in slide-in-from-bottom-4 fade-in duration-700">
               <Link to="/" className="inline-flex items-center gap-2 mb-8 group opacity-80 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform duration-300">
                     <img src="/logo.png" alt="Whisper Logo" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="font-display font-bold text-lg tracking-tight">Whisper</span>
               </Link>
               
               <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">
                  {step === 1 ? 'Create Identity.' : 'Secure Vault.'}
               </h1>
               <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  {step === 1 ? 'Join the most secure network on the planet.' : 'Set up your master key to encrypt your data.'}
               </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
               <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ x: -20, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ x: -20, opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-5"
                    >
                       <InputField 
                          label="Display Name"
                          placeholder="What should we call you?"
                          value={formData.name}
                          onChange={(e) => {
                             setFormData({ ...formData, name: e.target.value });
                             clearError('name');
                          }}
                          error={errors.name}
                          icon={User}
                          autoFocus
                       />

                       <InputField 
                          label="Username"
                          placeholder="@username"
                          value={formData.username}
                          onChange={(e) => {
                             setFormData({ ...formData, username: e.target.value });
                             clearError('username');
                          }}
                          error={errors.username}
                          icon={({size, className}) => <span className={`font-bold text-lg ${className}`}>@</span>}
                       />

                       <InputField 
                          label="Email"
                          placeholder="name@example.com"
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                             setFormData({ ...formData, email: e.target.value });
                             clearError('email');
                          }}
                          error={errors.email}
                          icon={Mail}
                       />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ x: 20, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ x: 20, opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="space-y-5"
                    >
                       <InputField 
                          label="About (Optional)"
                          placeholder="I love encrypted chats..."
                          value={formData.about}
                          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                          icon={Info}
                          autoFocus
                       />

                       <InputField 
                          label="Master Password"
                          placeholder="••••••••••••"
                          type="password"
                          value={formData.password}
                          onChange={(e) => {
                             setFormData({ ...formData, password: e.target.value });
                             clearError('password');
                          }}
                          error={errors.password}
                          icon={Lock}
                       />

                       <InputField 
                          label="Confirm Password"
                          placeholder="••••••••••••"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => {
                             setFormData({ ...formData, confirmPassword: e.target.value });
                             clearError('confirmPassword');
                          }}
                          error={errors.confirmPassword}
                          icon={ShieldCheck}
                       />
                    </motion.div>
                  )}
               </AnimatePresence>

               {/* Action Buttons */}
               <div className="pt-6">
                  {step === 1 ? (
                     <Button 
                        type="button" 
                        onClick={handleNext} 
                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-orange-400 hover:to-orange-500 text-black font-bold text-lg hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                     >
                        Continue <ArrowRight className="ml-2 w-5 h-5" />
                     </Button>
                  ) : (
                     <div className="flex gap-4">
                        <Button 
                           type="button" 
                           variant="ghost" 
                           onClick={handleBack} 
                           className="h-14 w-[72px] rounded-2xl border border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white transition-all duration-300"
                        >
                           <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <Button 
                           type="submit" 
                           disabled={loading} 
                           className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-primary to-orange-400 hover:to-orange-500 text-black font-bold text-lg hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                        >
                           {loading ? <Loader2 className="animate-spin mr-2" /> : 'Create Account'}
                        </Button>
                     </div>
                  )}
               </div>
            </form>

            <div className="mt-8 text-center animate-in fade-in duration-1000 delay-300">
               <p className="text-muted-foreground/60 text-sm font-medium">
                  Already have an identity? 
                  <Link to="/login" className="text-primary font-bold ml-2 hover:underline decoration-2 underline-offset-4 decoration-primary/50 hover:decoration-primary transition-all">Sign In</Link>
               </p>
            </div>
         </div>
      </div>

      {/* RIGHT SIDE: Visual Area */}
      <div className="hidden lg:flex w-1/2 bg-[#050505] relative overflow-hidden items-center justify-center border-l border-white/5">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>
         
         {/* Animated Background Blobs */}
         <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" 
         />
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px]" 
         />

         {/* Content */}
         <div className="relative z-10 p-16 max-w-2xl">
            <h2 className="text-6xl font-black text-white mb-8 leading-[0.9] tracking-tight">
               Join the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary bg-300% animate-gradient">Revolution.</span>
            </h2>
            
            <div className="space-y-8 mt-12">
               {[
                  { icon: ShieldCheck, title: "Military-Grade Encryption", desc: "Your messages are encrypted using AES-256 before they even leave your device." },
                  { icon: Zap, title: "Lightning Fast", desc: "Built on a distributed edge network for latency-free instant message delivery." },
                  { icon: Globe, title: "Truly Anonymous", desc: "No phone number. No email verification. Just you and your cryptographic keys." }
               ].map((item, index) => (
                  <motion.div 
                     key={index}
                     initial={{ x: 50, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 0.5 + (index * 0.1) }}
                     className="flex items-start gap-5 group"
                  >
                     <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center shrink-0 text-primary/80 group-hover:text-primary group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                        <item.icon size={26} /> 
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground/70 mt-1 leading-relaxed max-w-md">{item.desc}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
