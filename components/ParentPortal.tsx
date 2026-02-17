
import React from 'react';
import { Student, ShuttleRoute, StudentStatus, ShuttleStatus } from '../types';
import { 
  Bus, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  MessageCircle,
  BellRing,
  Wallet,
  CheckCircle,
  Info
} from 'lucide-react';

interface ParentPortalProps {
  student: Student;
  route: ShuttleRoute;
}

const ParentPortal: React.FC<ParentPortalProps> = ({ student, route }) => {
  const isEnRoute = route.status === ShuttleStatus.PICKING_UP || route.status === ShuttleStatus.DROPPING_OFF;
  
  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Payment Status Card - New Section */}
      <div className={`p-5 rounded-2xl border flex items-center gap-4 shadow-sm transition-all ${
        student.isPaid 
          ? 'bg-emerald-50 border-emerald-100' 
          : 'bg-amber-50 border-amber-100 animate-pulse'
      }`}>
        <div className={`p-3 rounded-xl ${student.isPaid ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
          <Wallet size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Iuran Bulanan (Rp 200rb)</p>
          <h4 className={`font-bold text-lg ${student.isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
            {student.isPaid ? 'Pembayaran Lunas' : 'Belum Terbayar'}
          </h4>
          {!student.isPaid && <p className="text-[10px] text-amber-600 font-medium italic">Silakan hubungi Driver untuk pembayaran</p>}
        </div>
        {student.isPaid && <CheckCircle size={24} className="text-emerald-500" />}
        {!student.isPaid && <Info size={24} className="text-amber-500" />}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Status Kehadiran</p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{student.name}</h2>
          </div>
          <button className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            <BellRing size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-6 shadow-sm">
          <div className="p-3 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-emerald-900">
              {student.status === StudentStatus.ON_BOARD ? 'Dalam Kendaraan' : 
               student.status === StudentStatus.AT_SCHOOL ? 'Sudah di Sekolah' : 
               'Menunggu Penjemputan'}
            </h4>
            <p className="text-xs text-emerald-600 font-medium">Terakhir diperbarui: Baru saja</p>
          </div>
        </div>

        <div className="space-y-6 relative before:content-[''] before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
          <TimelineItem 
            active={true}
            icon={<MapPin size={14} />} 
            label="Titik Jemput (Rumah)" 
            time="06:45 WIB" 
            sub="Selesai" 
            completed={student.status !== StudentStatus.AT_HOME}
          />
          <TimelineItem 
            active={student.status === StudentStatus.ON_BOARD}
            icon={<Bus size={14} />} 
            label="Perjalanan" 
            time={isEnRoute ? "Sedang Jalan" : "Menunggu"} 
            sub={isEnRoute ? "Driver: Pak Jajang" : "Estimasi mulai 06:40"}
            completed={student.status === StudentStatus.AT_SCHOOL}
          />
          <TimelineItem 
            active={student.status === StudentStatus.AT_SCHOOL}
            icon={<Clock size={14} />} 
            label="Tiba di Sekolah" 
            time="07:15 WIB" 
            sub="Target Tiba" 
            completed={student.status === StudentStatus.AT_SCHOOL}
          />
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Bus size={18} className="text-indigo-400" />
          Info Armada & Driver
        </h3>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold border-2 border-slate-700 shadow-lg">
            J
          </div>
          <div className="flex-1">
            <h4 className="font-bold">{route.driverName}</h4>
            <p className="text-xs text-slate-400">{route.vehicleNumber} • Rating 4.9 ⭐</p>
          </div>
          <button className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            <MessageCircle size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <InfoBox label="Kecepatan" value="35 km/h" />
          <InfoBox label="Estimasi Tiba" value="12 mnt" highlight />
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl shadow-sm">
        <AlertCircle size={20} className="text-orange-500 shrink-0" />
        <p className="text-sm text-orange-700 font-medium">Harap stand-by di titik jemput 5 menit lebih awal untuk kelancaran rute.</p>
      </div>
    </div>
  );
};

const TimelineItem = ({ icon, label, time, sub, active, completed }: any) => (
  <div className="flex gap-4 relative">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-500 ${
      completed ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 
      active ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'
    }`}>
      {icon}
    </div>
    <div>
      <div className="flex items-center gap-2">
        <p className={`font-bold text-sm ${completed || active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</p>
        {completed && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-bold">Done</span>}
      </div>
      <p className={`text-xs ${active ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>{time}</p>
      <p className="text-[10px] text-slate-400 italic mt-0.5">{sub}</p>
    </div>
  </div>
);

const InfoBox = ({ label, value, highlight }: any) => (
  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</p>
    <p className={`font-bold text-lg ${highlight ? 'text-indigo-400' : 'text-white'}`}>{value}</p>
  </div>
);

export default ParentPortal;
