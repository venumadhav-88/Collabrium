
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Captcha from '../components/Captcha';

const LogoMark: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="logoLoginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5Z" fill="url(#logoLoginGrad)" />
      <path d="M35 45 L50 30 L65 45 V75 H35 V45Z" fill="white" fillOpacity="0.3" />
      <path d="M50 30 V75 M35 55 H65" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isCaptchaValid) {
      setError("Security code verification failed.");
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Invalid institutional credentials provided.");
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: 'ADMIN' | 'STUDENT') => {
    setIsSubmitting(true);
    setError(null);
    const demoEmail = role === 'ADMIN' ? 'admin@admin.edu' : 'student@student.edu';
    const demoPass = role === 'ADMIN' ? 'admin@12313' : 'student@12313';
    
    const success = await login(demoEmail, demoPass);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Demo login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-4 mb-6">
            <LogoMark />
            <span className="font-serif text-2xl text-blue-950 tracking-tight">AcademiaCollab</span>
          </Link>
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Institutional Access</h1>
          <p className="text-slate-500">Enter your scholarly credentials to proceed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder="name@university.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Security Verification</label>
                <Captcha 
                  value={captchaInput}
                  onChange={setCaptchaInput}
                  onVerify={setIsCaptchaValid}
                />
              </div>
            </div>

            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full py-4 bg-blue-950 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In to Portal <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="bg-white px-4 text-slate-400">Demo Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN')}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
              >
                <ShieldCheck className="w-4 h-4" /> Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('STUDENT')}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all"
              >
                <UserCircle className="w-4 h-4" /> Student
              </button>
            </div>
          </form>

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              New to the platform? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register your unit</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Lab Security</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
