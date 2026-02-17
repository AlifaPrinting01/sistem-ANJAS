
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
        setSaveStatus('Profil berhasil diperbarui di database!');
      } else if (activeModal === 'Keamanan Password') {
        // Simulasi verifikasi password lama
        if (passwords.current === '') {
          alert('Password lama harus diisi!');
          setIsSubmitting(false);
          return;
        }
        if (passwords.next !== passwords.confirm) {
          alert('Konfirmasi password baru tidak cocok!');
          setIsSubmitting(false);
          return;
        }
        
        // Simpan password ke localStorage (simulasi update DB)
        const storageKey = role === 'DRIVER' ? 'kidgo_driver_pass' : 'kidgo_parent_pass';
        localStorage.setItem(storageKey, passwords.next);
        setSaveStatus('Password berhasil diupdate di database!');
        setPasswords({ current: '', next: '', confirm: '' });
      } else if (activeModal === 'Metode Pembayaran') {
        setSaveStatus(`Metode pembayaran utama: ${paymentMethod}`);
      }

      setIsSubmitting(false);
      setActiveModal(null);
      setTimeout(() => setSaveStatus(null), 3000);
      window.dispatchEvent(new Event('storage'));
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

      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">{activeModal}</h3>
              <button disabled={isSubmitting} onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveData} className="space-y-4">
              {activeModal === 'Ubah Profil' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Baru</label>
                    <input type="text" autoFocus value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-800" required />
                  </div>
                  {role === 'DRIVER' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plat Mobil Baru</label>
                      <input type="text" value={tempVehicle} onChange={(e) => setTempVehicle(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-slate-800" required />
                    </div>
                  )}
                </div>
              )}
              {activeModal === 'Keamanan Password' && (
                <div className="space-y-4">
                  <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Lama</label><input type="password" placeholder="••••••••" className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none mt-1 font-bold" onChange={(e) => setPasswords({...passwords, current: e.target.value})} required /></div>
                  <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password Baru</label><input type="password" placeholder="••••••••" className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none mt-1 font-bold" onChange={(e) => setPasswords({...passwords, next: e.target.value})} required /></div>
                  <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Konfirmasi</label><input type="password" placeholder="••••••••" className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none mt-1 font-bold" onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} required /></div>
                </div>
              )}
              {activeModal === 'Metode Pembayaran' && (
                <div className="grid grid-cols-1 gap-2">
                  {['GOPAY', 'OVO', 'Transfer Bank', 'Tunai'].map(method => (
                    <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`flex items-center justify-between p-4 border rounded-2xl transition-all ${paymentMethod === method ? 'bg-indigo-50 border-indigo-200' : 'border-slate-100 hover:bg-slate-50'}`}>
                      <span className={`font-bold ${paymentMethod === method ? 'text-indigo-600' : 'text-slate-600'}`}>{method}</span>
                      {paymentMethod === method && <CheckCircle2 size={16} className="text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
              <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> PROSES...</> : 'SIMPAN KE DATABASE'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 bg-slate-900 text-white flex items-center gap-6">
           <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black border-4 border-slate-800 ${role === 'DRIVER' ? 'bg-orange-500' : 'bg-emerald-500'}`}>{user.name?.[0]}</div>
           <div><h2 className="text-2xl font-black tracking-tight">{user.name}</h2><p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{role === 'DRIVER' ? `Supir • ${user.vehicle}` : `Wali Siswa: ${user.student}`}</p></div>
        </div>
        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Akun & Keamanan</h3>
            <div className="space-y-1">
              <SettingsLink icon={<User size={18} />} label="Ubah Profil" onClick={() => setActiveModal('Ubah Profil')} />
              <SettingsLink icon={<Shield size={18} />} label="Ganti Password" onClick={() => setActiveModal('Keamanan Password')} />
              <SettingsLink icon={<CreditCard size={18} />} label="Pembayaran" badge={paymentMethod} onClick={() => setActiveModal('Metode Pembayaran')} />
            </div>
          </section>
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Preferensi</h3>
            <div className="space-y-1">
              <SettingsLink icon={<Bell size={18} />} label="Notifikasi" toggle toggleActive={notifEnabled} onClick={() => { setNotifEnabled(!notifEnabled); setSaveStatus(`Notifikasi ${!notifEnabled ? 'Aktif' : 'Mati'}`); setTimeout(() => setSaveStatus(null), 2000); }} />
              <SettingsLink icon={<Phone size={18} />} label="Kontak Bantuan" onClick={() => alert('CS: 0899-123-456')} />
            </div>
          </section>
          <div className="pt-4 border-t border-slate-100 text-center"><p className="text-[10px] text-slate-400 font-black tracking-widest">KidGo Cloud Database v2.0</p></div>
        </div>
      </div>
    </div>
  );
};

const SettingsLink = ({ icon, label, badge, toggle, toggleActive, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
    <div className="flex items-center gap-4"><div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl group-hover:bg-indigo-100 group-hover:text-indigo-600">{icon}</div><span className="font-bold text-slate-700">{label}</span></div>
    <div className="flex items-center gap-2">{badge && <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg">{badge}</span>}
      {toggle ? <div className={`w-12 h-7 rounded-full relative p-1 transition-all ${toggleActive ? 'bg-indigo-600' : 'bg-slate-200'}`}><div className={`w-5 h-5 bg-white rounded-full transition-all ${toggleActive ? 'ml-5' : 'ml-0'}`}></div></div> : <ChevronRight size={18} className="text-slate-300" />}
    </div>
  </button>
);

export default SettingsPortal;
