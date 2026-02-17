
import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldAlert } from 'lucide-react';

interface DriverAuthProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const DriverAuth: React.FC<DriverAuthProps> = ({ onLoginSuccess, onBack }) => {
  const [formData, setFormData] = useState({ email: '', pin: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulasi login supir
    setTimeout(() => {
      if (formData.email === 'driver@kidgo.com' && formData.pin === '1234') {
        onLoginSuccess();
      } else {
        setError('Email atau PIN salah. (Gunakan: driver@kidgo.com / 1234)');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-sm mb-6 flex items-center gap-1 transition-colors">
          &larr; Kembali
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-lg shadow-orange-100/50">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Login Supir</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Akses Portal Management Armada KidGo</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-3 animate-in shake duration-300">
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terdaftar</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="driver@kidgo.com"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PIN Keamanan</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="password" 
                required
                maxLength={4}
                value={formData.pin}
                onChange={e => setFormData({...formData, pin: e.target.value})}
                placeholder="••••"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-medium text-slate-800 tracking-widest"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 mt-4 tracking-wider"
          >
            {isLoading ? 'MEMVERIFIKASI...' : 'MASUK KE DASHBOARD'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-medium">Gunakan PIN default untuk testing: <span className="text-orange-600 font-bold">1234</span></p>
        </div>
      </div>
    </div>
  );
};

export default DriverAuth;
