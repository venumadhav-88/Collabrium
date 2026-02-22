
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCcw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
  value: string;
  onChange: (val: string) => void;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify, value, onChange }) => {
  const [captchaText, setCaptchaText] = useState('');

  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    onChange(''); // Clear input on refresh
  }, [onChange]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  useEffect(() => {
    onVerify(value.toUpperCase() === captchaText);
  }, [value, captchaText, onVerify]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div 
          className="flex-1 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden select-none"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px' }}
        >
          {/* Noise lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%">
              <line x1="0" y1="10" x2="100%" y2="40" stroke="#1e3a8a" strokeWidth="1" />
              <line x1="0" y1="40" x2="100%" y2="10" stroke="#1e3a8a" strokeWidth="1" />
            </svg>
          </div>
          <span className="text-xl font-serif font-black tracking-[0.4em] text-blue-900 italic transform skew-x-12 opacity-80">
            {captchaText}
          </span>
        </div>
        <button 
          type="button"
          onClick={generateCaptcha}
          className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          title="Regenerate CAPTCHA"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </div>
      <input
        type="text"
        placeholder="Enter security code"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border-2 border-slate-100 rounded-lg px-4 py-2 text-sm focus:border-blue-500 outline-none transition-all uppercase font-bold tracking-widest"
      />
    </div>
  );
};

export default Captcha;
