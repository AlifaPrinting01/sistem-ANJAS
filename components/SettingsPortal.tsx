
import React, { useState } from 'react';
import { User, Bell, Shield, Phone, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';

interface SettingsPortalProps {
  role: string;
  user: any;
}

const SettingsPortal: React.FC<SettingsPortalProps> = ({ role, user }) => {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSimulateSave = (label: string) => {
    setSaveStatus(`Mengupdate ${label}...`);
    setTimeout(() => {
      setSaveStatus(`${label} berhasil diperbarui!`);
      setTimeout(() => setSaveStatus(null), 2000);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {saveStatus && (
        <div className="fixed top-20 right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-bold">{saveStatus}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 bg-slate-900 text-white flex items-center gap-6">
           <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold border-4 border-slate-800 ${role === 'DRIVER' ? 'bg-orange-500' : 'bg-emerald-500'}`}>
             {user.name?.[0]}
           </div>
           <div>
             <h2 className="text-2xl font-bold">{user.name}</h2>
             <p className="text-slate-400 text-sm">{role === 'DRIVER' ? 'Supir Utama KidGo' : `Orang Tua dari ${user.student}`}</p>
           </div>
        </div>

        {/* Settings Groups */}
        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Akun & Keamanan</h3>
            <div className="space-y-1">
              <SettingsLink icon={<User size={18} />} label="Ubah Profil" onClick={() => handleSimulateSave('Profil')} />
              <SettingsLink icon={<Shield size={18} />} label="Keamanan Password" onClick={() => handleSimulateSave('Password')} />
              <SettingsLink icon={<CreditCard size={18} />} label="Metode Pembayaran" badge="GOPAY" onClick={() => handleSimulateSave('Metode Pembayaran')} />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Preferensi</h3>
            <div className="space-y-1">
              <SettingsLink icon={<Bell size={18} />} label="Notifikasi Penjemputan" toggle onClick={() => handleSimulateSave('Pengaturan Notifikasi')} />
              <SettingsLink icon={<Phone size={18} />} label="Kontak Darurat" onClick={() => handleSimulateSave('Kontak Darurat')} />
            </div>
          </section>

          <div className="pt-4 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400 font-medium">KidGo v1.2.4 (Beta Access)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsLink = ({ icon, label, badge, toggle, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
        {icon}
      </div>
      <span className="font-semibold text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-md">{badge}</span>}
      {toggle ? (
        <div className="w-10 h-6 bg-indigo-600 rounded-full relative p-1 transition-colors">
          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
        </div>
      ) : (
        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
      )}
    </div>
  </button>
);

export default SettingsPortal;
