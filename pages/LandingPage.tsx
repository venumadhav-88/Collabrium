
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Layers, 
  Activity, 
  CheckCircle2, 
  FileText, 
  Users, 
  Clock, 
  ChevronRight,
  Database,
  Lock,
  MessageSquare,
  BarChart3,
  Quote
} from 'lucide-react';

// --- Utility Components ---

const LogoMark: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <div className={`${className} relative group transition-transform duration-500 hover:rotate-[360deg]`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5Z" fill="url(#logoGradient)" />
      <path d="M35 45 L50 30 L65 45 V75 H35 V45Z" fill="white" fillOpacity="0.25" />
      <path d="M50 30 V75 M35 55 H65" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="2" strokeOpacity="0.1" />
    </svg>
  </div>
);

const CountUp: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// --- Main Landing Page ---

const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dashboardView, setDashboardView] = useState<'ADMIN' | 'RESEARCHER'>('ADMIN');
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Auto-switch dashboard preview simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardView(prev => prev === 'ADMIN' ? 'RESEARCHER' : 'ADMIN');
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={containerRef} className="relative bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[110] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white/95 backdrop-blur-md border-b border-slate-100 h-20 flex items-center">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4">
            <LogoMark />
            <span className="font-serif text-2xl text-blue-950 tracking-tight">AcademiaCollab</span>
          </Link>
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
            <button onClick={() => scrollToId('governance')} className="hover:text-blue-600 transition-colors uppercase cursor-pointer">Governance</button>
            <button onClick={() => scrollToId('collaboration')} className="hover:text-blue-600 transition-colors uppercase cursor-pointer">Collaboration</button>
            <button onClick={() => scrollToId('lifecycle')} className="hover:text-blue-600 transition-colors uppercase cursor-pointer">Lifecycle</button>
            <Link to="/login" className="px-6 py-2.5 bg-blue-950 text-white rounded font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/10">Portal Access</Link>
          </div>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <header className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center bg-[#fcfcfc] overflow-hidden">
        <div className="container mx-auto px-6 z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.3em] text-blue-700 uppercase bg-blue-50/80 rounded-full border border-blue-100"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Institutional Research Management
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl font-serif text-blue-950 leading-[1.05] mb-10"
            >
              Scholarly Excellence <br />
              <span className="italic text-blue-600">Unified.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-500 mb-14 max-w-2xl leading-relaxed font-light"
            >
              The digital framework for high-impact research units. Synchronize data, 
              automate compliance, and accelerate discovery across global campuses.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link to="/register" className="group w-full sm:w-auto px-12 py-5 bg-blue-950 text-white rounded-md font-bold text-lg flex items-center justify-center gap-3 hover:bg-blue-900 shadow-2xl shadow-blue-900/20 transition-all hover:-translate-y-1">
                Start as Researcher <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-12 py-5 bg-white border border-slate-200 text-blue-950 rounded-md font-bold text-lg hover:border-blue-400 transition-all flex items-center justify-center gap-3 shadow-sm">
                Admin Access
              </Link>
            </motion.div>
          </div>

          {/* Hero Metrics */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-slate-100 pt-14"
          >
            {[
              { label: "Active Initiatives", value: 120, suffix: "+" },
              { label: "Elite Researchers", value: 340, suffix: "+" },
              { label: "Compliance Rate", value: 95, suffix: "%" },
              { label: "Data Integrity", value: 99.9, suffix: "%" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-5xl font-serif text-blue-900 tracking-tight">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Parallax Background Decor */}
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 0.2], [0, 150]) }}
          className="absolute right-[-10%] top-1/4 -z-0 opacity-[0.03] pointer-events-none select-none hidden lg:block"
        >
          <div className="text-[30rem] font-serif italic text-blue-900 leading-none select-none rotate-12">Scholarly</div>
        </motion.div>
      </header>

      {/* 2. Problem → Solution Narrative Section */}
      <section className="relative py-40 bg-white overflow-hidden" id="governance">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-24">
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-serif text-blue-950 mb-8 leading-tight">
                Academic silos are the <br /> <span className="italic text-blue-600">silent friction</span> of progress.
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                Institutional discovery is often stalled by fragmented tools. AcademiaCollab transforms 
                the chaos of decentralized research into a structured, high-governance environment.
              </p>
            </FadeIn>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {[
              { 
                icon: Activity, 
                title: "Fragmented Data", 
                desc: "Information trapped in emails and siloed spreadsheets leads to data provenance issues and lost insights.",
              },
              { 
                icon: Clock, 
                title: "Missed Deadlines", 
                desc: "Opaque project timelines result in critical milestone slippage and administrative friction during audits.",
              },
              { 
                icon: Layers, 
                title: "Version Conflicts", 
                desc: "Manual document exchange compromises dataset integrity and complicates the scholarly peer-review cycle.",
              }
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group h-full p-10 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                    <card.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-serif text-blue-950 mb-6">{card.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Feature Pillars Section */}
      <section className="py-40 bg-blue-950 text-white" id="collaboration">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <FadeIn>
              <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Architecture of Governance.</h2>
              <p className="text-blue-200 text-lg font-light leading-relaxed">
                Purpose-built modules that respect the complexity of elite scholarly environments.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              { 
                icon: Database, 
                title: "Project Governance", 
                desc: "Enterprise oversight for complex timelines. Monitor every sub-task in real-time across multiple research units.",
                features: ["Timeline Visualization", "Resource Allocation", "Funding Audits"]
              },
              { 
                icon: Lock, 
                title: "Secure Exchange", 
                desc: "Version-controlled storage for sensitive materials. Integrated metadata ensures full provenance for audits.",
                features: ["Metadata Tagging", "AES-256 Encryption", "Access Logs"]
              },
              { 
                icon: MessageSquare, 
                title: "Contextual Threads", 
                desc: "Discussion layers linked directly to research artifacts. Reduce noise and eliminate context switching.",
                features: ["Artifact Linking", "Threaded Discussions", "Role Hierarchy"]
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col h-full bg-white/5 p-10 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-12 shadow-xl shadow-blue-600/20">
                  <pillar.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif mb-8">{pillar.title}</h3>
                <p className="text-blue-100/70 mb-10 leading-relaxed text-sm flex-1">{pillar.desc}</p>
                <ul className="space-y-4 pt-10 border-t border-white/10 mt-auto">
                  {pillar.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                      <div className="w-1 h-1 rounded-full bg-blue-400" /> {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Live Dashboard Preview Section */}
      <section className="py-40 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <FadeIn>
                <h2 className="text-4xl md:text-5xl font-serif text-blue-950 mb-8 italic">Dual Perspective UI.</h2>
                <p className="text-xl text-slate-600 mb-12 font-light leading-relaxed">
                  Seamlessly toggle between administrative oversight and detailed researcher workflows. 
                  Experience zero-friction transition across institutional roles.
                </p>
                
                <div className="flex gap-4 p-1.5 bg-slate-200 rounded-lg w-fit mb-12">
                  {['ADMIN', 'RESEARCHER'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setDashboardView(role as any)}
                      className={`px-10 py-3.5 rounded-md text-[10px] font-black uppercase tracking-[0.25em] transition-all cursor-pointer ${
                        dashboardView === role 
                          ? 'bg-blue-950 text-white shadow-xl shadow-blue-950/20' 
                          : 'bg-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {role} Portal
                    </button>
                  ))}
                </div>

                <div className="space-y-8">
                  <div className="flex gap-6 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-serif italic text-lg transition-transform group-hover:scale-110">1</div>
                    <p className="text-slate-600 text-sm leading-relaxed"><span className="text-blue-900 font-bold block mb-1">Impact Visualization</span> Animated scores and engagement heatmaps derived from live laboratory participation.</p>
                  </div>
                  <div className="flex gap-6 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-serif italic text-lg transition-transform group-hover:scale-110">2</div>
                    <p className="text-slate-600 text-sm leading-relaxed"><span className="text-blue-900 font-bold block mb-1">Lifecycle Tracking</span> Monitor discovery stages from initial hypothesis to final institutional publication.</p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="relative">
              <motion.div 
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl shadow-[0_40px_100px_-20px_rgba(30,58,138,0.15)] border border-slate-200 overflow-hidden aspect-[4/3] p-12 flex flex-col gap-10"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={dashboardView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex-1 flex flex-col gap-10"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-2 w-32 bg-slate-100 rounded-full" />
                        <div className="h-5 w-48 bg-blue-900 rounded-md" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-end gap-3">
                        <div className="h-2 w-16 bg-blue-200 rounded-full" />
                        <div className="h-6 w-1/2 bg-blue-600 rounded-md" />
                      </div>
                      <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-end gap-3">
                        <div className="h-2 w-16 bg-blue-200 rounded-full" />
                        <div className="h-6 w-1/2 bg-blue-600 rounded-md" />
                      </div>
                    </div>

                    <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
                       <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-full px-12 space-y-4">
                           <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                             <motion.div animate={{ width: ['20%', '80%', '60%'] }} transition={{ duration: 4, repeat: Infinity }} className="h-full bg-blue-600" />
                           </div>
                           <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                             <motion.div animate={{ width: ['10%', '90%', '40%'] }} transition={{ duration: 3, repeat: Infinity }} className="h-full bg-blue-500" />
                           </div>
                         </div>
                       </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                <div className="text-center mt-auto">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Prototype Interface v1.0.4</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Research Lifecycle Timeline */}
      <section className="py-40 bg-white" id="lifecycle">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-serif text-blue-950 mb-8 italic">The Scholarly Cycle.</h2>
              <p className="text-slate-500 text-lg font-light leading-relaxed">
                Meticulous tracking from the initial proposal through to global impact.
              </p>
            </FadeIn>
          </div>

          <div className="relative pb-20">
            {/* Timeline Line */}
            <div className="absolute top-[45px] left-0 w-full h-[1px] bg-slate-100" />
            <motion.div 
              style={{ width: useTransform(scrollYProgress, [0.65, 0.85], ["0%", "100%"]) }}
              className="absolute top-[45px] left-0 h-[1px] bg-blue-600 origin-left z-10"
            />

            <div className="grid grid-cols-2 md:grid-cols-6 gap-12 relative z-20">
              {[
                { label: "Conceptualize", desc: "Institutional Funding" },
                { label: "Literature Review", desc: "Scoping Discovery" },
                { label: "Experimentation", desc: "Data Acquisition" },
                { label: "Analysis", desc: "Synthesis Cycle" },
                { label: "Peer Review", desc: "External Validation" },
                { label: "Impact", desc: "Global Publication" }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-[90px] h-[90px] bg-white border border-slate-100 rounded-full mx-auto mb-10 flex items-center justify-center text-xs font-black text-slate-300 transition-all group-hover:border-blue-600 group-hover:text-blue-600 group-hover:shadow-2xl group-hover:shadow-blue-600/10">
                    {i + 1}
                  </div>
                  <h4 className="text-sm font-bold text-blue-950 uppercase tracking-widest mb-3">{step.label}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Credibility Section */}
      <section className="py-32 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Trusted Institutional Partners</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32 opacity-25 grayscale mb-32 pointer-events-none">
            {['OXFORD RES', 'STANFORD UNIT', 'GENEVA LAB', 'MITROV GROUP'].map(l => (
              <span key={l} className="text-3xl font-serif font-black tracking-tighter italic whitespace-nowrap">{l}</span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <FadeIn>
              <div className="p-16 bg-white rounded-3xl border border-slate-200 shadow-sm relative h-full">
                <Quote className="absolute top-10 right-10 w-12 h-12 text-slate-50" />
                <p className="text-2xl font-serif text-slate-700 leading-relaxed mb-12 italic">
                  "The transition to AcademiaCollab has optimized our administrative governance by 40%, 
                  allowing our research leads to focus on experimental synthesis rather than documentation friction."
                </p>
                <div className="flex items-center gap-5 mt-auto">
                  <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden">
                    <img src="https://picsum.photos/seed/director/100/100" alt="Dr. Elena Rossi" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-blue-950 uppercase tracking-widest">Dr. Elena Rossi</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Director of Research, BioGen Unit</p>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <div className="p-16 bg-blue-950 text-white rounded-3xl shadow-2xl flex flex-col justify-center h-full">
                <div className="flex items-center gap-4 mb-10 text-blue-400">
                  <Lock className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Privacy & Ethics</span>
                </div>
                <h3 className="text-3xl font-serif mb-8">Scholarly Data Integrity.</h3>
                <p className="text-blue-100/70 text-lg leading-relaxed font-light mb-10">
                  We adhere to international standards for research ethics and data protection. 
                  Every byte of intellectual property is governed by high-encryption protocols.
                </p>
                <Link to="/register" className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:text-white transition-colors">
                  View Ethics Policy <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 7. Final CTA Section */}
      <section className="py-48 bg-blue-950 relative overflow-hidden">
        {/* Visual Noise Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-5xl md:text-8xl font-serif text-white mb-10 leading-tight">
              Synchronize your <br /> <span className="italic text-blue-400">Discovery Cycle.</span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-200/80 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Join the institutional ecosystem ready to elevate scholarly collaboration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" className="w-full sm:w-auto px-16 py-6 bg-blue-600 text-white rounded-md font-bold text-xl hover:bg-blue-500 shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1">
                Create Researcher Account
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-16 py-6 bg-transparent border border-white/20 text-white rounded-md font-bold text-xl hover:bg-white/10 transition-all">
                Admin Portal Sign In
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. Professional Footer */}
      <footer className="bg-white py-24 border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-4 mb-10">
                <LogoMark />
                <span className="font-serif text-2xl text-blue-950 tracking-tight">AcademiaCollab</span>
              </div>
              <p className="text-slate-500 max-sm text-sm leading-relaxed mb-10">
                The global institutional standard for cross-unit research collaboration, 
                designed for scholarly units that prioritize governance and discovery.
              </p>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                System Build v1.0.4-Beta.Institutional
              </div>
            </div>
            
            <div className="space-y-10">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-950">Framework</h5>
              <ul className="space-y-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                <li><button onClick={() => scrollToId('governance')} className="hover:text-blue-600 transition-colors uppercase cursor-pointer text-left">Governance</button></li>
                <li><button onClick={() => scrollToId('collaboration')} className="hover:text-blue-600 transition-colors uppercase cursor-pointer text-left">Collaboration</button></li>
                <li><button onClick={() => scrollToId('lifecycle')} className="hover:text-blue-600 transition-colors uppercase cursor-pointer text-left">Lifecycle</button></li>
              </ul>
            </div>

            <div className="space-y-10">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-950">Operational</h5>
              <ul className="space-y-6 text-xs font-bold uppercase tracking-widest text-slate-400">
                <li><Link to="/login" className="hover:text-blue-600 transition-colors uppercase">Support Portal</Link></li>
                <li><Link to="/register" className="hover:text-blue-600 transition-colors uppercase">Lab Integration</Link></li>
                <li><a href="mailto:support@academiacollab.edu" className="hover:text-blue-600 transition-colors uppercase">Contact Unit</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">© 2024 Institutional Research Framework. All scholarly rights reserved.</p>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              <a href="#" className="hover:text-blue-600 transition-colors">Security Protocols</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Terms of Discovery</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
