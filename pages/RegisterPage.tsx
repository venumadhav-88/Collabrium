
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import Captcha from '../components/Captcha';

const LogoMark: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <div className={`${className} relative`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="logoRegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <path d="M50 5 L92 28 V72 L50 95 L8 72 V28 L50 5Z" fill="url(#logoRegGrad)" />
      <path d="M35 45 L50 30 L65 45 V75 H35 V45Z" fill="white" fillOpacity="0.3" />
      <path d="M50 30 V75 M35 55 H65" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  </div>
);

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'RESEARCHER' as Role
  });
  const [captchaInput, setCaptchaInput] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 8) {
      setError("Security requirement: Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Credential mismatch: Passwords do not match.");
      return;
    }

    if (!isCaptchaValid) {
      setError("Security code verification failed.");
      return;
    }

    setIsSubmitting(true);
    const success = await register(formData.name, formData.email, formData.password, formData.role);
    
    if (success) {
      // Small delay for cinematic effect
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setError("Account initialization failed: Email already registered in institutional database.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-4 mb-6">
            <LogoMark />
            <span className="font-serif text-2xl text-blue-950 tracking-tight">AcademiaCollab</span>
          </Link>
          <h1 className="text-3xl font-serif text-slate-900 mb-2">Account Initialization</h1>
          <p className="text-slate-500">Create your scholarly profile for cross-unit collaboration</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 outline-none transition-all text-sm"
                      placeholder="Dr. Alexander Vance"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Institutional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 outline-none transition-all text-sm"
                      placeholder="vance@univ.edu"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Institutional Role</label>
                  <div className="flex gap-3">
                    {['ADMIN', 'RESEARCHER'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFormData({...formData, role: r as Role})}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold tracking-widest transition-all border-2 ${
                          formData.role === r 
                            ? 'bg-blue-950 border-blue-950 text-white shadow-lg shadow-blue-900/20' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Set Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 outline-none transition-all text-sm"
                      placeholder="Min. 8 chars"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      required
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 outline-none transition-all text-sm"
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
            </div>

            <button 
              disabled={isSubmitting}
              type="submit" 
              className="w-full py-4 bg-blue-950 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 animate-pulse" />
                  Initialising Unit...
                </div>
              ) : (
                <>Register Institutional Profile <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already registered? <Link to="/login" className="text-blue-600 font-bold hover:underline">Return to Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
