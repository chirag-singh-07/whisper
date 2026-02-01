import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, Shield, Zap, Globe, Github, Twitter, ArrowRight, 
  CheckCircle2, Star, Lock, Heart, ShieldCheck, Smartphone, 
  Users, Activity, Command, MoreHorizontal, Image as ImageIcon, Mic,
  FileLock, UserPlus, MessageCircle, Check, X, ChevronDown, RefreshCcw, LockKeyhole, Fingerprint
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

  const features = [
    {
      icon: <ShieldCheck className="text-primary" size={32} />,
      title: "End-to-End Encrypted",
      description: "AES-256 encryption ensures only you and your recipient can read what is sent.",
      className: "col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white/5 to-white/0"
    },
    {
      icon: <Zap className="text-primary" size={32} />,
      title: "Lightning Fast",
      description: "Engineered for speed with < 50ms latency globally.",
      className: "col-span-1 md:col-span-1 bg-gradient-to-br from-white/5 to-white/0"
    },
    {
      icon: <Globe className="text-primary" size={32} />,
      title: "Global Infrastructure",
      description: "Distributed edge servers ensure reliability anywhere on Earth.",
      className: "col-span-1 md:col-span-1 bg-gradient-to-br from-white/5 to-white/0"
    },
    {
      icon: <Smartphone className="text-primary" size={32} />,
      title: "Cross-Platform",
      description: "Seamless sync between iOS, Android, and Web.",
      className: "col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-white/5 to-white/0"
    }
  ];

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden hover:border-primary/30 transition-colors">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="w-full py-6 px-8 flex items-center justify-between text-left focus:outline-none"
        >
          <span className="text-lg font-bold text-white">{question}</span>
          <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="px-8 pb-6 text-muted-foreground leading-relaxed">
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary overflow-x-hidden font-sans w-full">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-grid-white opacity-[0.05]" />
      <motion.div style={{ y: yHero }} className="fixed top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10" />

      {/* Navbar: Full Width & Real Look */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="w-full max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="text-primary" size={20} />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Whisper</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-muted-foreground/80">
            <a href="#features" className="hover:text-primary transition-colors hover:bg-white/5 py-2 px-4 rounded-full">Features</a>
            <a href="#security" className="hover:text-primary transition-colors hover:bg-white/5 py-2 px-4 rounded-full">Security</a>
            <a href="#download" className="hover:text-primary transition-colors hover:bg-white/5 py-2 px-4 rounded-full">Download</a>
          </div>

          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-white hover:text-primary hover:bg-white/5 font-medium hidden sm:inline-flex"
            >
              Log In
            </Button>
            <Button 
              onClick={() => navigate('/register')}
              className="bg-primary text-white hover:bg-primary/90 rounded-full px-6 font-bold shadow-[0_0_20px_rgba(255,102,0,0.3)] hover:shadow-[0_0_30px_rgba(255,102,0,0.5)] transition-all"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Star size={10} className="fill-primary" />
            <span>The Future of Private Messaging</span>
          </motion.div>

          <motion.div style={{ opacity: opacityHero }}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              PRIVACY <br />
              <span className="text-gradient-orange">REIMAGINED.</span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Experience the golden standard of secure communication. <br/>
            End-to-end encrypted, beautifully designed, and built for speed.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="h-14 px-10 rounded-full bg-white text-black hover:bg-gray-100 font-bold text-lg shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
            >
              Start Chatting Now
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="h-14 px-10 rounded-full border-white/20 text-white bg-white/5 hover:bg-white/10 font-bold text-lg w-full sm:w-auto"
            >
              View Documentation
            </Button>
          </motion.div>
        </div>

        {/* Detailed Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-[1200px] mx-auto mt-24 relative"
        >
           {/* Glow Effect */}
           <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full opacity-50" />
           
           <div className="rounded-[2rem] border border-white/10 bg-[#09090b] shadow-2xl overflow-hidden relative">
             {/* Window Controls */}
             <div className="h-12 border-b border-white/10 flex items-center px-6 gap-2 bg-[#09090b]/50 backdrop-blur-md">
               <div className="w-3 h-3 rounded-full bg-red-500/80" />
               <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
               <div className="w-3 h-3 rounded-full bg-green-500/80" />
               <div className="flex-1 text-center text-xs ml-[-60px] font-mono text-muted-foreground/50">whisper-client-v2.0</div>
             </div>

             {/* UI Layout */}
             <div className="flex h-[600px]">
               {/* Sidebar */}
               <div className="w-80 border-r border-white/10 bg-black/40 flex flex-col hidden md:flex">
                 <div className="p-4">
                   <div className="bg-white/5 rounded-xl h-10 w-full animate-pulse" />
                 </div>
                 <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${i===1 ? 'bg-primary text-white' : 'bg-white/10'}`}>
                           {i === 1 ? 'JD' : <Users size={18} className="opacity-50" />}
                        </div>
                        <div className="flex-1">
                          <div className="h-3 w-24 bg-white/20 rounded mb-2" />
                          <div className="h-2 w-16 bg-white/10 rounded" />
                        </div>
                      </div>
                    ))}
                 </div>
               </div>

               {/* Chat Area */}
               <div className="flex-1 flex flex-col bg-[#09090b]">
                  <div className="h-16 border-b border-white/10 flex items-center px-6 justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500" />
                        <div>
                          <div className="font-bold text-white">Engineering Team</div>
                          <div className="text-xs text-primary flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Online
                          </div>
                        </div>
                     </div>
                     <MoreHorizontal className="text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 p-6 space-y-6 overflow-hidden relative">
                     {/* Chat Messages */}
                     <div className="flex gap-4 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                        <div>
                           <div className="bg-white/10 p-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-white/90">
                              Hey team, just deployed the new encryption protocol. Latency is looking incredible! 🚀
                           </div>
                           <div className="text-[10px] text-muted-foreground mt-2 pl-2">10:42 AM</div>
                        </div>
                     </div>

                     <div className="flex gap-4 max-w-[80%] self-end flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0" />
                        <div>
                           <div className="bg-primary p-4 rounded-2xl rounded-tr-sm text-sm leading-relaxed text-white font-medium">
                              Fantastic work! I'm seeing the stats on the dashboard. Sub-30ms globally.
                           </div>
                           <div className="text-[10px] text-muted-foreground mt-2 text-right pr-2">10:44 AM • Read</div>
                        </div>
                     </div>
                     
                     {/* Floating Badge */}
                     <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs flex items-center gap-2">
                        <Lock size={12} className="text-primary" />
                        <span>Messages are end-to-end encrypted</span>
                     </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/10">
                     <div className="bg-white/5 rounded-full h-14 flex items-center px-6 gap-4">
                        <ImageIcon size={20} className="text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                        <div className="flex-1 text-muted-foreground/50 text-sm">Type a message...</div>
                        <Mic size={20} className="text-muted-foreground hover:text-white transition-colors cursor-pointer" />
                     </div>
                  </div>
               </div>
             </div>
           </div>
        </motion.div>
      </section>

      {/* Features Bento Grid: Full Width Container */}
      <section id="features" className="py-32 px-6 relative">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="mb-20 text-center">
             <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Built for the <br /> <span className="text-primary">Paranoid & Power Users.</span></h2>
             <p className="text-muted-foreground max-w-2xl mx-auto font-medium">We obsess over every pixel and every packet. Whisper isn't just a chat app; it's a statement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${feature.className} p-1 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 transition-colors duration-500 group`}
              >
                 <div className="bg-card w-full h-full rounded-[20px] p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                    
                    <div>
                       <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                       <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Scroll / Social Proof was here - moving down */}
      
      {/* How It Works Section */}
      <section className="py-32 px-6 relative border-t border-white/5">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Zero Trace. <span className="text-primary">Zero Effort.</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Get started in seconds. No phone number required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <div className="hidden md:block absolute top-[20%] left-[16%] right-[16%] h-[2px] bg-linear-to-r from-primary/0 via-primary/30 to-primary/0 border-t border-dashed border-white/20" />
             
             {[
               { icon: <UserPlus size={32} />, title: "Create Identity", desc: "Generate a unique ID locally. No email, no phone number." },
               { icon: <FileLock size={32} />, title: "Exchange Keys", desc: "Securely share your public key with friends to start an encrypted tunnel." },
               { icon: <MessageCircle size={32} />, title: "Chat Silently", desc: "Messages are destroyed on delivery. Nothing is stored on servers." }
             ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-[#0D0D0F] border border-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,162,97,0.1)] group hover:scale-110 transition-transform duration-300">
                      <div className="text-primary">{step.icon}</div>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                   <p className="text-muted-foreground max-w-xs">{step.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 px-6 bg-white/2">
        <div className="w-full max-w-[1400px] mx-auto">
           <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white">Why <span className="text-primary">Whisper?</span></h2>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                 <thead>
                    <tr className="border-b border-white/10">
                       <th className="py-8 text-left text-xl font-bold text-white pl-8">Feature</th>
                       <th className="py-8 text-center text-xl font-bold text-primary">Whisper</th>
                       <th className="py-8 text-center text-xl font-bold text-muted-foreground opacity-50">Signal</th>
                       <th className="py-8 text-center text-xl font-bold text-muted-foreground opacity-50">Telegram</th>
                    </tr>
                 </thead>
                 <tbody>
                    {[
                       { feature: "End-to-End Encryption", whisper: true, signal: true, telegram: "Optional" },
                       { feature: "No Phone Number Required", whisper: true, signal: false, telegram: false },
                       { feature: "P2P Architecture", whisper: true, signal: false, telegram: false },
                       { feature: "Self-Destruct Messages", whisper: true, signal: true, telegram: true },
                       { feature: "Metadata Stripping", whisper: true, signal: "Partial", telegram: false },
                    ].map((row, i) => (
                       <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                          <td className="py-6 pl-8 text-white font-medium">{row.feature}</td>
                          <td className="py-6 text-center">
                             <div className="flex justify-center">
                                <CheckCircle2 className="text-primary fill-primary/10" size={24} />
                             </div>
                          </td>
                          <td className="py-6 text-center text-muted-foreground">
                             {row.signal === true ? <Check className="mx-auto" /> : row.signal === false ? <X className="mx-auto text-red-500/50" /> : <span className="text-xs uppercase font-bold">{row.signal}</span>}
                          </td>
                          <td className="py-6 text-center text-muted-foreground">
                             {row.telegram === true ? <Check className="mx-auto" /> : row.telegram === false ? <X className="mx-auto text-red-500/50" /> : <span className="text-xs uppercase font-bold">{row.telegram}</span>}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 relative">
         <div className="w-full max-w-[1000px] mx-auto">
            <h2 className="text-4xl font-black text-white mb-16 text-center">Frequently Asked <span className="text-primary">Questions</span></h2>
            
            <div className="space-y-4">
               {[
                  { q: "Is it really free?", a: "Yes. Whisper is open-source and community funded. There are no ads, no trackers, and no paywalls for core features." },
                  { q: "How do you make money?", a: "We run on donations and enterprise licensing for private on-premise deployments. Your data is never the product." },
                  { q: "Can I use it on multiple devices?", a: "Yes! Your private key is your identity. You can securely export it to other devices to sync your chats." },
                  { q: "What happens if I lose my key?", a: "Because we don't store your data, we cannot recover your account. This is a security feature, not a bug. Keep your key safe." },
               ].map((faq, i) => (
                  <FAQItem key={i} question={faq.q} answer={faq.a} />
               ))}
            </div>
         </div>
      </section>

      {/* Infinite Scroll / Social Proof */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="flex gap-8 animate-infinite-scroll min-w-max">
           {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-8">
                 {["Security First", "Zero Knowledge", "Open Source", "Audited", "No Trackers", "Anonymous", "Decentralized"].map((text, j) => (
                    <div key={j} className="flex items-center gap-4 text-3xl font-black text-white/20 uppercase">
                       <span>{text}</span>
                       <Star size={24} className="fill-white/20" />
                    </div>
                 ))}
              </div>
           ))}
        </div>
      </section>

      {/* CTA Footer: Full Width */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto relative z-10">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="bg-primary rounded-[3rem] p-12 md:p-24 relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
             <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
                   Ready to go silent?
                </h2>
                <p className="text-white/80 text-xl font-bold max-w-2xl mx-auto mb-12">
                   Join 100,000+ users who have already switched to the most secure messaging platform on the planet.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <Button size="xl" className="h-16 px-12 rounded-full bg-white text-primary hover:bg-gray-100 font-bold text-xl">
                      Get Whisper Free
                   </Button>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/10 bg-black">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-sm text-muted-foreground">
              © 2025 Whisper Inc. Built for privacy.
           </div>
           
           <div className="flex items-center gap-8">
              <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors"><Globe size={20} /></a>
           </div>
        </div>
      </footer>
    </div>
  );
}

// End of file

