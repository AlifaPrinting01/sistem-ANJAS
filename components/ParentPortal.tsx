
import React from 'react';
import { Student, ShuttleRoute, StudentStatus, ShuttleStatus } from '../types';
import { 
  Bus, 
  MapPin, 
  ShieldCheck, 
  Wallet, 
  Info, 
  XCircle, 
  AlarmClock, 
  CheckCircle2, 
  Phone, 
  Sparkles, 
  GraduationCap,
  RotateCcw
} from 'lucide-react';

interface ParentPortalProps {
  student: Student;
  route: ShuttleRoute;
  onReportAbsence: (studentId: string, status: StudentStatus) => void;
}

const ParentPortal: React.FC<ParentPortalProps> = ({ student, route, onReportAbsence }) => {
  const isEnRoute = route.status === ShuttleStatus.PICKING_UP;
  const isArrived = student.status === StudentStatus.AT_SCHOOL;
  const isAbsent = student.status === StudentStatus.ABSENT;
  const isLate = student.status === StudentStatus.LATE_WAKE_UP;
  const isWaiting = student.status === StudentStatus.WAITING;
  const isInactive = isAbsent || isLate;
  
  const FEES = {
    NORMAL: 200000,
    HOLIDAY: 150000,
    EXTENDED: 250000
  };

  const handleAction = () => {
    if (isInactive) {
      // Fitur UNDO: Jika sebelumnya lapor absen, sekarang lapor jadi masuk
      if (confirm('Batalkan status absen? Driver akan diberitahu bahwa anak Anda jadi ikut jemputan hari ini.')) {
        onReportAbsence(student.id, StudentStatus.WAITING);
      }
    } else if (student.status === StudentStatus.AT_HOME) {
      // Fitur SIAP JEMPUT
      if (confirm('Beri sinyal ke Driver bahwa anak sudah siap di depan rumah?')) {
        onReportAbsence(student.id, StudentStatus.WAITING);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Profil Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border-2 border-indigo-100">
          <GraduationCap size={32} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 leading-none">{student.name}</h2>
          <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Kelas {student.className} • Kloter {student.batch}</p>
        </div>
      </div>

      {/* Banner Selesai */}
      {isArrived && (
        <div className="p-6 bg-emerald-600 text-white rounded-3xl shadow-xl shadow-emerald-600/20 flex flex-col items-center text-center gap-3 animate-in zoom-in duration-500">
           <div className="p-4 bg-white/20 rounded-full">
            <CheckCircle2 size={48} />
           </div>
           <div>
             <h4 className="font-black text-2xl tracking-tight">Anak Sudah Tiba!</h4>
             <p className="text-sm text-emerald-100 font-medium">{student.name} telah sampai di sekolah dengan selamat.</p>
           </div>
        </div>
      )}

      {/* Banner Notifikasi Laporan Aktif */}
      {isInactive && (
        <div className="p-5 bg-slate-900 text-white rounded-3xl shadow-xl flex items-center gap-4 animate-in slide-in-from-top duration-500">
           <div className={`p-3 rounded-2xl ${isAbsent ? 'bg-red-500' : 'bg-orange-500'}`}>
            {isAbsent ? <XCircle size={28} /> : <AlarmClock size={28} />}
           </div>
           <div className="flex-1">
             <h4 className="font-bold text-base leading-none">{isAbsent ? 'Status: Izin (Absen)' : 'Status: Antar Sendiri'}</h4>
             <p className="text-[10px] text-slate-400 mt-1 font-medium">Driver tidak akan berhenti di titik jemput Anda.</p>
           </div>
        </div>
      )}

      {/* TOMBOL DINAMIS: SIAP JEMPUT / UNDO ABSEN */}
      {!isArrived && (
        <button 
          onClick={handleAction}
          className={`w-full p-8 rounded-3xl shadow-2xl flex items-center justify-between group transition-all active:scale-95 animate-in zoom-in duration-300 border-4 ${
            isWaiting 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-600 cursor-default' 
              : isInactive
                ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700'
                : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700'
          }`}
          disabled={isWaiting}
        >
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${isWaiting ? 'bg-emerald-500 text-white' : 'bg-white/20'}`}>
              {isInactive ? <RotateCcw size={32} /> : <Sparkles size={32} />}
            </div>
            <div className="text-left">
              <h4 className="font-black text-2xl leading-none">
                {isWaiting ? 'SINYAL TERKIRIM' : isInactive ? 'JADI MASUK SEKOLAH' : 'SIAP DIJEMPUT'}
              </h4>
              <p className={`text-[11px] mt-1 font-black tracking-widest uppercase ${isWaiting ? 'text-emerald-500' : isInactive ? 'text-blue-200' : 'text-indigo-200'}`}>
                {isWaiting ? 'Driver Menuju ke Lokasi Anda' : isInactive ? 'Batalkan Absen & Ikut Jemputan' : 'Tekan Saat Anak Sudah Standby'}
              </p>
            </div>
          </div>
          {!isWaiting && <CheckCircle2 size={24} className={isInactive ? "text-blue-300" : "text-indigo-300"} />}
        </button>
      )}

      {/* Info Iuran */}
      <div className={`p-6 rounded-3xl border-2 flex items-center gap-4 shadow-sm ${
        student.isPaid ? 'bg-white border-slate-100' : 'bg-amber-50 border-amber-200 animate-pulse'
      }`}>
        <div className={`p-3 rounded-2xl ${student.isPaid ? 'bg-slate-100 text-slate-400' : 'bg-amber-500 text-white shadow-lg'}`}>
          <Wallet size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Iuran Bulanan ({student.feeType})</p>
          <h4 className="font-black text-lg text-slate-900">Rp {FEES[student.feeType].toLocaleString('id-ID')}</h4>
          <span className={`text-[10px] font-black ${student.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
            {student.isPaid ? 'PEMBAYARAN LUNAS' : 'MENUNGGU PEMBAYARAN'}
          </span>
        </div>
        {!student.isPaid && <Info size={24} className="text-amber-500" />}
      </div>

      {/* Monitoring Kedatangan */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">Proses Jemputan</h3>
        
        <div className="space-y-8 relative before:content-[''] before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
          <TimelineItem 
            active={!isInactive && !isArrived}
            icon={<MapPin size={16} />} 
            label="Penjemputan" 
            time={`Kloter ${student.batch}`} 
            sub={isInactive ? "Dilewati Sesuai Laporan" : student.status === StudentStatus.ON_BOARD || isArrived ? "Anak Sudah di Mobil" : "Sedang Menjemput"} 
            completed={student.status === StudentStatus.ON_BOARD || isArrived}
          />
          <TimelineItem 
            active={isEnRoute}
            icon={<Bus size={16} />} 
            label="Dalam Perjalanan" 
            time={isEnRoute ? "Sedang Jalan" : "Menuju Sekolah"} 
            sub={isArrived ? "Perjalanan Selesai" : `Driver: ${route.driverName}`}
            completed={isArrived}
          />
          <TimelineItem 
            active={isArrived}
            icon={<ShieldCheck size={16} />} 
            label="Sampai Sekolah" 
            time="Tujuan" 
            sub={isArrived ? "Hadir di Sekolah" : "Belum Tiba"} 
            completed={isArrived}
          />
        </div>

        {!isInactive && !isArrived && !isWaiting && (
          <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 gap-3">
             <button 
              onClick={() => { if(confirm('Lapor telat? Supir akan melewati Anda.')) onReportAbsence(student.id, StudentStatus.LATE_WAKE_UP); }}
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 text-orange-600 rounded-2xl hover:bg-orange-100 transition-all"
            >
              <AlarmClock size={20} />
              <span className="text-[10px] font-black uppercase">Telat</span>
            </button>
            <button 
              onClick={() => { if(confirm('Lapor tidak masuk hari ini?')) onReportAbsence(student.id, StudentStatus.ABSENT); }}
              className="flex flex-col items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all"
            >
              <XCircle size={20} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Izin</span>
            </button>
          </div>
        )}
      </div>

      {/* Info Armada */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative group">
        <h3 className="font-bold mb-6 flex items-center gap-2 text-indigo-400 uppercase text-[10px] tracking-widest">
          <Bus size={14} /> INFORMASI SUPIR
        </h3>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-3xl font-black border-2 border-indigo-400/30">J</div>
          <div className="flex-1">
            <h4 className="font-black text-xl tracking-tight">{route.driverName}</h4>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{route.vehicleNumber}</p>
          </div>
          <a href={`tel:${"0812345678"}`} className="p-4 bg-slate-800 text-indigo-400 rounded-2xl border border-slate-700 active:scale-95 transition-transform">
            <Phone size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ icon, label, time, sub, active, completed }: any) => (
  <div className="flex gap-6 relative">
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all duration-500 border-2 ${
      completed ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg' : 
      active ? 'bg-indigo-600 border-indigo-600 text-white animate-pulse shadow-lg' : 
      'bg-white border-slate-100 text-slate-300'
    }`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <p className={`font-black text-base tracking-tight ${completed || active ? 'text-slate-900' : 'text-slate-300'}`}>{label}</p>
      </div>
      <p className={`text-[11px] font-bold ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{time}</p>
      <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">{sub}</p>
    </div>
  </div>
);

export default ParentPortal;
