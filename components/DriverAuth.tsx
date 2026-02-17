
import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldAlert, UserPlus, Truck, User } from 'lucide-react';
import { db } from '../services/databaseService';
import { DriverAccount } from '../types';

interface DriverAuthProps {
  onLoginSuccess: (email: string) => void;
  onBack: () => void;
}

const DriverAuth: React.FC<DriverAuthProps> = ({ onLoginSuccess, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    pin: '', 
    name: '', 
    vehicleNumber: '' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const drivers = db.getDrivers();

      if (isRegistering) {
        // Proses Registrasi
        if (drivers.find(d => d.email === formData.email)) {
          setError('Email sudah terdaftar.');
          setIsLoading(false);
          return;
        }

        const newDriver: DriverAccount = {
          email: formData.email,
          password: formData.pin,
          name: formData.name,
          vehicleNumber: formData.vehicleNumber
        };

        db.addDriver(newDriver);
        alert('Pendaftaran Berhasil! Armada Anda telah disiapkan.');
        setIsRegistering(false);
        setIsLoading(false);
      } else {
        // Proses Login
        const driver = drivers.find(d => d.email === formData.email && d.password === formData.pin);
        if (driver) {
          onLoginSuccess(driver.email);
        } else {
          setError('Email atau PIN salah.');
          setIsLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-sm mb-6 flex items-center gap-1 transition-colors">
          &larr; Kembali
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-lg shadow-orange-100/50">
            {isRegistering ? <UserPlus size={32} /> : <Lock size={32} />}
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {isRegistering ? 'Daftar Driver' : 'Login Driver'}
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            {isRegistering ? 'Gabung sebagai mitra jemputan KidGo' : 'Akses Portal Management Armada'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-3 animate-in shake duration-300">
            <ShieldAlert size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <div className="animate-in slide-in-from-top duration-300 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Nama Anda"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 outline-none font-medium"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Kendaraan</label>
                <div className="relative">
                  <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required
                    value={formData.vehicleNumber}
                    onChange={e => setFormData({...formData, vehicleNumber: e.target.value})}
                    placeholder="Contoh: B 1234 XYZ"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 outline-none font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Terdaftar</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="email@kidgo.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PIN Keamanan (4 Digit)</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="password" 
                required
                maxLength={4}
                value={formData.pin}
                onChange={e => setFormData({...formData, pin: e.target.value})}
                placeholder="••••"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:border-orange-500 outline-none font-medium text-slate-800 tracking-widest"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 mt-4"
          >
            {isLoading ? 'MEMPROSES...' : isRegistering ? 'DAFTAR SEKARANG' : 'MASUK KE DASHBOARD'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            {isRegistering ? 'Sudah punya akun? Login' : 'Belum punya akun? Registrasi Driver'}
          </button>
          {!isRegistering && (
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Testing: driver@kidgo.com / 1234</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverAuth;
