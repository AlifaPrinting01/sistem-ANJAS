
import React, { useState } from 'react';
import { User, Bell, Shield, Phone, CreditCard, ChevronRight, CheckCircle2, X } from 'lucide-react';

interface SettingsPortalProps {
  role: string;
  user: any;
}

const SettingsPortal: React.FC<SettingsPortalProps> = ({ role, user }) => {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState(user);

  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(`Mengupdate ${activeModal}...`);
    setTimeout(() => {
      setSaveStatus(`${activeModal} berhasil diperbarui!`);
      setActiveModal(null);
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      {saveStatus && (
        <div className="fixed top-20 right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-[60]">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-bold">{saveStatus}</span>
        </div>
      )}

      {/* MODAL FORMS */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">{activeModal}</h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveData} className="space-y-4">
              {activeModal === 'Ubah Profil' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                  <input 
                    type="text" 
                    defaultValue={localUser.name}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-medium" 
                    placeholder="Masukkan nama baru"
                  />
                </div>
              )}

              {activeModal === 'Keamanan Password' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                    <input type="password" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-medium mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
                    <input type="password" className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none font-medium mt-1" />
                  </div>
                </div>
              )}

              {activeModal === 'Metode Pembayaran' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pilih Metode</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['GOPAY', 'OVO', 'Transfer Bank', 'Tunai'].map(method => (
                      <button 
                        key={method}
                        type="button"
                        className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors text-left"
                      >
                        <span className="font-semibold text-slate-700">{method}</span>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 mt-4">
                SIMPAN PERUBAHAN
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 bg-slate-900 text-white flex items-center gap-6">
           <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold border-4 border-slate-800 ${role === 'DRIVER' ? 'bg-orange-500' : 'bg-emerald-500'}`}>
             {localUser.name?.[0]}
           </div>
           <div>
             <h2 className="text-2xl font-bold">{localUser.name}</h2>
             <p className="text-slate-400 text-sm font-medium">{role === 'DRIVER' ? 'Supir Utama KidGo' : `Orang Tua dari ${localUser.student}`}</p>
           </div>
        </div>

        {/* Settings Groups */}
        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Akun & Keamanan</h3>
            <div className="space-y-1">
              <SettingsLink icon={<User size={18} />} label="Ubah Profil" onClick={() => setActiveModal('Ubah Profil')} />
              <SettingsLink icon={<Shield size={18} />} label="Keamanan Password" onClick={() => setActiveModal('Keamanan Password')} />
              <SettingsLink icon={<CreditCard size={18} />} label="Metode Pembayaran" badge="GOPAY" onClick={() => setActiveModal('Metode Pembayaran')} />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Preferensi</h3>
            <div className="space-y-1">
              <SettingsLink icon={<Bell size={18} />} label="Notifikasi Penjemputan" toggle onClick={() => setSaveStatus('Notifikasi diaktifkan!')} />
              <SettingsLink icon={<Phone size={18} />} label="Kontak Darurat" onClick={() => setActiveModal('Kontak Darurat')} />
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
