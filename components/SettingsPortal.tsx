
import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Phone, CreditCard, ChevronRight, CheckCircle2, X, Loader2 } from 'lucide-react';

interface SettingsPortalProps {
  role: string;
  user: any;
  onUpdateProfile: (name: string, vehicle?: string) => void;
}

const SettingsPortal: React.FC<SettingsPortalProps> = ({ role, user, onUpdateProfile }) => {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk input formulir
  const [tempName, setTempName] = useState(user.name);
  const [tempVehicle, setTempVehicle] = useState(user.vehicle || '');
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [paymentMethod, setPaymentMethod] = useState(() => localStorage.getItem('kidgo_payment') || 'GOPAY');
  const [notifEnabled, setNotifEnabled] = useState(() => localStorage.getItem('kidgo_notif') !== 'false');

  useEffect(() => {
    localStorage.setItem('kidgo_payment', paymentMethod);
    localStorage.setItem('kidgo_notif', notifEnabled.toString());
  }, [paymentMethod, notifEnabled]);

  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (activeModal === 'Ubah Profil') {
        onUpdateProfile(tempName, tempVehicle);
        setSaveStatus('Profil berhasil diperbarui!');
      } else if (activeModal === 'Keamanan Password') {
        if (passwords.next !== passwords.confirm) {
          alert('Konfirmasi password tidak cocok!');
          setIsSubmitting(false);
          return;
        }
        setSaveStatus('Password berhasil diubah!');
        setPasswords({ current: '', next: '', confirm: '' });
      } else if (activeModal === 'Metode Pembayaran') {
        setSaveStatus(`Metode pembayaran diatur ke ${paymentMethod}`);
      }

      setIsSubmitting(false);
      setActiveModal(null);
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      {saveStatus && (
        <div className="fixed top-20 right-8 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-[60]">
          <CheckCircle2 size={20} className="text-white" />
          <span className="text-sm font-black">{saveStatus}</span>
        </div>
      )}

      {/* MODAL FORMS */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">{activeModal}</h3>
              <button 
                disabled={isSubmitting}
                onClick={() => setActiveModal(null)} 
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveData} className="space-y-4">
              {activeModal === 'Ubah Profil' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap Baru</label>
                    <input 
                      type="text" 
                      autoFocus
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-800 transition-all" 
                      placeholder="Masukkan nama"
                      required
                    />
                  </div>
                  {role === 'DRIVER' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Plat Mobil</label>
                      <input 
                        type="text" 
                        value={tempVehicle}
                        onChange={(e) => setTempVehicle(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-800 transition-all" 
                        placeholder="Contoh: B 1234 ABC"
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {activeModal === 'Keamanan Password' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Saat Ini</label>
                    <input 
                      type="password" 
                      className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none mt-1 font-bold" 
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                    <input 
                      type="password" 
                      className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none mt-1 font-bold" 
                      onChange={(e) => setPasswords({...passwords, next: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
                    <input 
                      type="password" 
                      className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none mt-1 font-bold" 
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      required
                    />
                  </div>
                </div>
              )}

              {activeModal === 'Metode Pembayaran' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Metode Utama</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['GOPAY', 'OVO', 'Transfer Bank', 'Tunai'].map(method => (
                      <button 
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`flex items-center justify-between p-4 border rounded-2xl transition-all text-left ${
                          paymentMethod === method ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`font-bold ${paymentMethod === method ? 'text-indigo-600' : 'text-slate-600'}`}>{method}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'
                        }`}>
                          {paymentMethod === method && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95 mt-4 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    MEMPROSES...
                  </>
                ) : (
                  'SIMPAN PERUBAHAN'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-8 bg-slate-900 text-white flex items-center gap-6">
           <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black border-4 border-slate-800 shadow-inner ${role === 'DRIVER' ? 'bg-orange-500' : 'bg-emerald-500'}`}>
             {user.name?.[0]}
           </div>
           <div>
             <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
             <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
               {role === 'DRIVER' ? `Supir Utama • ${user.vehicle}` : `Orang Tua dari ${user.student}`}
             </p>
           </div>
        </div>

        {/* Settings Groups */}
        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Akun & Keamanan</h3>
            <div className="space-y-1">
              <SettingsLink icon={<User size={18} />} label="Ubah Profil" onClick={() => { setTempName(user.name); setTempVehicle(user.vehicle || ''); setActiveModal('Ubah Profil'); }} />
              <SettingsLink icon={<Shield size={18} />} label="Keamanan Password" onClick={() => setActiveModal('Keamanan Password')} />
              <SettingsLink icon={<CreditCard size={18} />} label="Metode Pembayaran" badge={paymentMethod} onClick={() => setActiveModal('Metode Pembayaran')} />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Preferensi Aplikasi</h3>
            <div className="space-y-1">
              <SettingsLink 
                icon={<Bell size={18} />} 
                label="Notifikasi Penjemputan" 
                toggle 
                toggleActive={notifEnabled}
                onClick={() => {
                  setNotifEnabled(!notifEnabled);
                  setSaveStatus(`Notifikasi ${!notifEnabled ? 'diaktifkan' : 'dimatikan'}`);
                  setTimeout(() => setSaveStatus(null), 2000);
                }} 
              />
              <SettingsLink icon={<Phone size={18} />} label="Kontak Darurat Driver" onClick={() => alert('Fitur kontak darurat sedang disiapkan.')} />
            </div>
          </section>

          <div className="pt-4 border-t border-slate-100 text-center">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">KidGo v1.3.0 • Stable Release</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsLink = ({ icon, label, badge, toggle, toggleActive, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
        {icon}
      </div>
      <span className="font-bold text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {badge && <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg border border-indigo-100">{badge}</span>}
      {toggle ? (
        <div className={`w-12 h-7 rounded-full relative p-1 transition-all duration-300 ${toggleActive ? 'bg-indigo-600' : 'bg-slate-200'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${toggleActive ? 'ml-5' : 'ml-0'}`}></div>
        </div>
      ) : (
        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
      )}
    </div>
  </button>
);

export default SettingsPortal;
