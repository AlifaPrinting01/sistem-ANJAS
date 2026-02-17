
import React, { useState } from 'react';
import { ShuttleRoute, ShuttleStatus, StudentStatus, Student, MonthlyFeeType } from '../types';
import { 
  CheckCircle, 
  Wallet, 
  Plus, 
  X, 
  AlertTriangle, 
  AlarmClock, 
  Sparkles, 
  Layers, 
  GraduationCap,
  CheckCircle2,
  MapPin,
  Megaphone,
  Truck
} from 'lucide-react';

interface DriverPortalProps {
  routes: ShuttleRoute[];
  setRoutes: React.Dispatch<React.SetStateAction<ShuttleRoute[]>>;
  onTriggerAlert: (message: string, type: string) => void;
}

const DriverPortal: React.FC<DriverPortalProps> = ({ routes, setRoutes, onTriggerAlert }) => {
  const myRoute = routes[0];
  const [activeBatch, setActiveBatch] = useState<string>('1');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    className: '',
    batch: '1',
    address: '',
    parentName: ''
  });

  const EMERGENCY_REASONS = [
    { id: 'breakdown', label: 'Mobil Mogok / Kendala Mesin', msg: 'Mohon maaf, armada kami mengalami kendala mesin pagi ini. Orang tua diharapkan mengantar anak secara mandiri.' },
    { id: 'permit', label: 'Supir Izin / Berhalangan', msg: 'Mohon maaf, supir KidGo berhalangan hadir karena keperluan mendesak. Jemputan ditiadakan sementara.' },
    { id: 'traffic', label: 'Lalu Lintas Macet Total', msg: 'Terjadi kemacetan total di rute jemputan. Estimasi jemputan akan sangat terlambat.' }
  ];

  const FEES = {
    NORMAL: 200000,
    HOLIDAY: 150000,
    EXTENDED: 250000
  };

  const updateStatus = (studentId: string, newStatus: StudentStatus) => {
    setRoutes(prev => prev.map(route => ({
      ...route,
      students: route.students.map(s => s.id === studentId ? { ...s, status: newStatus } : s)
    })));
  };

  const togglePaymentStatus = (studentId: string) => {
    setRoutes(prev => prev.map(route => ({
      ...route,
      students: route.students.map(s => 
        s.id === studentId ? { ...s, isPaid: !s.isPaid } : s
      )
    })));
  };

  const cycleFeeType = (studentId: string) => {
    setRoutes(prev => prev.map(route => ({
      ...route,
      students: route.students.map(s => {
        if (s.id !== studentId) return s;
        let nextType: MonthlyFeeType = 'NORMAL';
        if (s.feeType === 'NORMAL') nextType = 'HOLIDAY';
        else if (s.feeType === 'HOLIDAY') nextType = 'EXTENDED';
        else nextType = 'NORMAL';
        return { ...s, feeType: nextType };
      })
    })));
  };

  const finishRoute = () => {
    if (confirm(`Selesaikan penjemputan Kloter ${activeBatch}? Semua siswa yang sudah naik akan ditandai sampai sekolah.`)) {
      setRoutes(prev => prev.map(route => ({
        ...route,
        status: ShuttleStatus.ARRIVED_AT_SCHOOL,
        students: route.students.map(s => 
          (s.batch === activeBatch && s.status === StudentStatus.ON_BOARD) ? { ...s, status: StudentStatus.AT_SCHOOL } : s
        )
      })));
    }
  };

  const sendEmergencyAlert = (msg: string) => {
    if (confirm('Kirim notifikasi darurat ini ke seluruh orang tua siswa?')) {
      onTriggerAlert(msg, 'danger');
      setShowEmergencyPanel(false);
    }
  };

  const filteredStudents = myRoute.students.filter(s => s.batch === activeBatch);
  
  const totalCollected = myRoute.students.reduce((acc, s) => {
    return s.isPaid ? acc + FEES[s.feeType] : acc;
  }, 0);

  const notificationStudents = myRoute.students.filter(s => 
    s.status === StudentStatus.ABSENT || 
    s.status === StudentStatus.LATE_WAKE_UP || 
    s.status === StudentStatus.WAITING
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tombol Darurat (Quick Access) */}
      <div className="bg-red-50 border-2 border-red-100 p-4 rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl animate-pulse">
            <Truck size={20} />
          </div>
          <div>
            <h5 className="text-[10px] font-black text-red-800 uppercase tracking-widest leading-none">Pusat Kendala</h5>
            <p className="text-xs text-red-600 font-medium">Ada masalah dengan armada?</p>
          </div>
        </div>
        <button 
          onClick={() => setShowEmergencyPanel(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95 flex items-center gap-2"
        >
          <Megaphone size={14} /> LAPOR KENDALA
        </button>
      </div>

      {/* Modal Emergency Panel */}
      {showEmergencyPanel && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Broadcast Darurat</h3>
                </div>
                <button onClick={() => setShowEmergencyPanel(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-slate-500 font-medium mb-6">Pilih kendala yang dialami untuk memberitahu seluruh orang tua agar mereka bisa mengantar anak secara mandiri.</p>

              <div className="space-y-3">
                {EMERGENCY_REASONS.map(reason => (
                  <button 
                    key={reason.id}
                    onClick={() => sendEmergencyAlert(reason.msg)}
                    className="w-full text-left p-4 border-2 border-slate-100 rounded-2xl hover:border-red-200 hover:bg-red-50 transition-all group"
                  >
                    <p className="font-black text-slate-800 group-hover:text-red-700 transition-colors">{reason.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">{reason.msg}</p>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-2">
                 <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center py-2">Bantuan Teknis: 0812-3456-7890</button>
              </div>
           </div>
        </div>
      )}

      {/* Statistik & Kloter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Kas Bulan Ini</p>
            <h4 className="text-2xl font-black text-slate-900 leading-none mt-1">Rp {totalCollected.toLocaleString('id-ID')}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
           <div className="flex gap-2">
             {['1', '2'].map(num => (
               <button 
                key={num}
                onClick={() => setActiveBatch(num)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  activeBatch === num 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
               >
                 KLOTER {num}
               </button>
             ))}
           </div>
           {myRoute.status === ShuttleStatus.PICKING_UP && (
             <button onClick={finishRoute} className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
               <CheckCircle size={20} />
             </button>
           )}
        </div>
      </div>

      {/* Panel Notifikasi Real-time */}
      {notificationStudents.length > 0 && (
        <div className="bg-white border-2 border-indigo-100 p-5 rounded-3xl shadow-xl space-y-3 animate-in fade-in slide-in-from-top duration-500">
           <div className="flex items-center gap-2 mb-2">
             <AlertTriangle className="text-indigo-500" size={18} />
             <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Pemberitahuan Orang Tua</h5>
           </div>
           <div className="space-y-2">
            {notificationStudents.map(s => (
              <div key={s.id} className={`flex items-center gap-4 py-3 px-4 rounded-2xl border-2 transition-all ${
                s.status === StudentStatus.WAITING ? 'bg-emerald-50 border-emerald-200 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`p-2 rounded-xl ${
                  s.status === StudentStatus.ABSENT ? 'bg-red-100 text-red-600' : 
                  s.status === StudentStatus.LATE_WAKE_UP ? 'bg-orange-100 text-orange-600' : 
                  'bg-emerald-500 text-white animate-pulse'
                }`}>
                  {s.status === StudentStatus.ABSENT ? <X size={18} /> : 
                    s.status === StudentStatus.LATE_WAKE_UP ? <AlarmClock size={18} /> : 
                    <Sparkles size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                    <span className="text-[9px] font-black bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase">Kloter {s.batch}</span>
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-tighter ${
                    s.status === StudentStatus.WAITING ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {s.status === StudentStatus.ABSENT ? 'IZIN TIDAK MASUK' : 
                      s.status === StudentStatus.LATE_WAKE_UP ? 'TELAT (ANTAR SENDIRI)' : 
                      'SUDAH SIAP DI DEPAN RUMAH!'}
                  </p>
                </div>
                <button 
                  onClick={() => updateStatus(s.id, StudentStatus.AT_HOME)}
                  className="text-[10px] font-black bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded-xl hover:text-indigo-600 hover:border-indigo-200 transition-all"
                >
                  OK
                </button>
              </div>
            ))}
           </div>
        </div>
      )}

      {/* Daftar Siswa Kloter */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Layers size={20} className="text-indigo-600" />
              Daftar Kloter {activeBatch} <span className="text-xs text-slate-400 font-normal">({filteredStudents.length} Siswa)</span>
            </h3>
            <button onClick={() => setIsAddingStudent(!isAddingStudent)} className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-xl uppercase flex items-center gap-1.5 hover:bg-slate-800 transition-colors">
              <Plus size={14} /> Tambah Siswa
            </button>
          </div>
          
          {isAddingStudent && (
            <div className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top duration-300">
               <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Input Data Siswa Baru</h4>
                <button onClick={() => setIsAddingStudent(false)}><X size={16} className="text-slate-400" /></button>
               </div>
               <form onSubmit={(e) => {
                 e.preventDefault();
                 const studentToAdd: Student = {
                   id: (Date.now() % 1000).toString(),
                   name: newStudent.name,
                   className: newStudent.className,
                   batch: newStudent.batch,
                   address: newStudent.address,
                   parentName: newStudent.parentName,
                   status: StudentStatus.AT_HOME,
                   isPaid: false,
                   feeType: 'NORMAL'
                 };
                 setRoutes(prev => prev.map(r => ({...r, students: [...r.students, studentToAdd]})));
                 setIsAddingStudent(false);
               }} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 <input type="text" placeholder="Nama Lengkap" required className="px-4 py-3 text-sm border rounded-xl outline-none focus:border-indigo-500 sm:col-span-2" onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                 <input type="text" placeholder="Kelas (contoh: 4-B)" required className="px-4 py-3 text-sm border rounded-xl outline-none focus:border-indigo-500" onChange={e => setNewStudent({...newStudent, className: e.target.value})} />
                 
                 <div className="flex flex-col gap-1 sm:col-span-1">
                   <label className="text-[9px] font-black text-slate-400 ml-1">PILIH KLOTER</label>
                   <select className="px-4 py-3 text-sm border rounded-xl bg-white outline-none" value={newStudent.batch} onChange={e => setNewStudent({...newStudent, batch: e.target.value})}>
                     <option value="1">Kloter 1</option>
                     <option value="2">Kloter 2</option>
                   </select>
                 </div>
                 <input type="text" placeholder="Nama Orang Tua" required className="px-4 py-3 text-sm border rounded-xl outline-none focus:border-indigo-500 sm:col-span-2 mt-auto" onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} />
                 
                 <input type="text" placeholder="Alamat Penjemputan" required className="px-4 py-3 text-sm border rounded-xl outline-none focus:border-indigo-500 sm:col-span-3" onChange={e => setNewStudent({...newStudent, address: e.target.value})} />
                 <button type="submit" className="bg-indigo-600 text-white font-black py-4 rounded-xl sm:col-span-3 shadow-lg hover:bg-indigo-700 transition-all">DAFTARKAN SISWA</button>
               </form>
            </div>
          )}

          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                <p className="text-slate-400 text-sm italic">Belum ada siswa di kloter ini.</p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isInactive = student.status === StudentStatus.ABSENT || student.status === StudentStatus.LATE_WAKE_UP;
                const isWaiting = student.status === StudentStatus.WAITING;
                const isAtSchool = student.status === StudentStatus.AT_SCHOOL;

                return (
                  <div key={student.id} className={`group border rounded-3xl overflow-hidden transition-all ${
                    isInactive ? 'opacity-40 grayscale bg-slate-50' : 'bg-white'
                  } ${isAtSchool ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 shadow-sm'}`}>
                    <div className={`flex items-center gap-4 p-5 ${student.status === StudentStatus.ON_BOARD ? 'bg-indigo-50/50' : ''}`}>
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                        isWaiting ? 'bg-emerald-500 border-emerald-400 text-white animate-bounce' : 'bg-slate-50 border-slate-200 text-indigo-400'
                      }`}>
                        {isAtSchool ? <CheckCircle2 size={24} className="text-emerald-500" /> : <GraduationCap size={20} />}
                        <span className="text-[9px] font-black mt-0.5">{student.className}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 truncate text-lg">{student.name}</h4>
                          {isWaiting && <span className="bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-sm">SIAP JEMPUT</span>}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          KLAS: <span className="text-indigo-600">{student.className}</span> • {student.address}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!isInactive && !isAtSchool && (
                          <button 
                            onClick={() => updateStatus(student.id, student.status === StudentStatus.ON_BOARD ? StudentStatus.AT_HOME : StudentStatus.ON_BOARD)} 
                            className={`px-5 py-3 rounded-2xl text-[10px] font-black transition-all shadow-sm ${
                              student.status === StudentStatus.ON_BOARD ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {student.status === StudentStatus.ON_BOARD ? 'TURUNKAN' : 'NAIK MOBIL'}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-50/50 px-6 py-3 flex flex-wrap items-center justify-between border-t border-slate-100 gap-3">
                      <div className="flex items-center gap-3">
                        <button 
                            onClick={() => cycleFeeType(student.id)}
                            className={`text-[9px] font-black px-3 py-1.5 rounded-xl border ${
                              student.feeType === 'NORMAL' ? 'bg-white text-blue-600' : 
                              student.feeType === 'HOLIDAY' ? 'bg-white text-orange-600' :
                              'bg-slate-900 text-white'
                            }`}
                          >
                            {student.feeType}
                          </button>
                          <button onClick={() => togglePaymentStatus(student.id)} className={`text-[10px] font-black ${student.isPaid ? 'text-emerald-600' : 'text-slate-400 underline decoration-dotted'}`}>
                            {student.isPaid ? '✓ LUNAS' : 'TANDAI LUNAS'}
                          </button>
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 italic">Student ID: {student.id}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPortal;
