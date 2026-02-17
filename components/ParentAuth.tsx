
import React, { useState, useEffect } from 'react';
import { Lock, Mail, UserPlus, Key, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ParentAccount, Student } from '../types';

interface ParentAuthProps {
  students: Student[];
  onLoginSuccess: (student: Student) => void;
  onBack: () => void;
}

const ParentAuth: React.FC<ParentAuthProps> = ({ students, onLoginSuccess, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentId: ''
  });
  const [error, setError] = useState('');

  // Simulasi database di LocalStorage
  const [accounts, setAccounts] = useState<ParentAccount[]>(() => {
    const saved = localStorage.getItem('kidgo_parent_accounts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kidgo_parent_accounts', JSON.stringify(accounts));
  }, [accounts]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      // Validasi ID Siswa
      const studentExists = students.find(s => s.id === formData.studentId);
      if (!studentExists) {
        setError('ID Siswa tidak ditemukan. Silakan minta ID ke Supir/Sekolah.');
        return;
      }

      // Validasi Email Unik
      if (accounts.find(a => a.email === formData.email)) {
        setError('Email sudah terdaftar.');
        return;
      }

      const newAccount: ParentAccount = { ...formData };
      setAccounts([...accounts, newAccount]);
      setIsRegistering(false);
      alert('Registrasi berhasil! Silakan login.');
    } else {
      // Login
      const account = accounts.find(a => a.email === formData.email && a.password === formData.password);
      if (account) {
        const student = students.find(s => s.id === account.studentId);
        if (student) {
          onLoginSuccess(student);
        } else {
          setError('Data siswa terkait akun ini tidak ditemukan.');
        }
      } else {
        setError('Email atau password salah.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-sm mb-6 flex items-center gap-1 transition-colors">
          &larr; Kembali
        </button>

        <div className="text-center mb-8">
          <div className={`inline-flex p-4 rounded-2xl mb-4 transition-colors ${isRegistering ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
            {isRegistering ? <UserPlus size={28} /> : <Lock size={28} />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{isRegistering ? 'Daftar Akun Baru' : 'Masuk Ke KidGo'}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isRegistering ? 'Lengkapi data untuk memantau anak' : 'Gunakan akun orang tua terdaftar'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2">
            <ShieldCheck size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">Email Orang Tua</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="email@contoh.com"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">Password</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              />
            </div>
          </div>

          {isRegistering && (
            <div className="animate-in slide-in-from-top duration-300">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 ml-1 tracking-wider">ID Siswa (Cek di Aplikasi Supir)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={formData.studentId}
                  onChange={e => setFormData({...formData, studentId: e.target.value})}
                  placeholder="ID contoh: 1 atau 2"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 mt-2 ${
              isRegistering 
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {isRegistering ? 'DAFTARKAN AKUN' : 'MASUK SEKARANG'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {isRegistering ? 'Sudah punya akun? Login' : 'Belum punya akun? Registrasi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentAuth;
