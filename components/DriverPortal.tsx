
import React, { useState } from 'react';
import { ShuttleRoute, ShuttleStatus, StudentStatus, Student, MonthlyFeeType } from '../types';
import { db } from '../services/databaseService';
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
  Megaphone,
  Truck,
  Trash2,
  Users,
  Edit2,
  Save
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
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  
  const [newStudent, setNewStudent] = useState({
    name: '',
    className: '',
    batch: '1',
    address: '',
    parentName: ''
  });

  const FEES = {
    NORMAL: 200000,
    HOLIDAY: 150000,
    EXTENDED: 250000
  };

  const updateStatus = (studentId: string, newStatus: StudentStatus) => {
    db.updateStudent(studentId, { status: newStatus });
  };

  const deleteStudent = (studentId: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data siswa "${name}"? Tindakan ini permanen.`)) {
      db.deleteStudent(studentId);
    }
  };

  const togglePaymentStatus = (studentId: string, current: boolean) => {
    db.updateStudent(studentId, { isPaid: !current });
  };

  const cycleFeeType = (studentId: string, current: MonthlyFeeType) => {
    let nextType: MonthlyFeeType = 'NORMAL';
    if (current === 'NORMAL') nextType = 'HOLIDAY';
    else if (current === 'HOLIDAY') nextType = 'EXTENDED';
    else nextType = 'NORMAL';
    db.updateStudent(studentId, { feeType: nextType });
  };

  const finishRoute = () => {
    if (confirm(`Selesaikan penjemputan Kloter ${activeBatch}?`)) {
      myRoute.students.forEach(s => {
        if (s.batch === activeBatch && s.status === StudentStatus.ON_BOARD) {
          db.updateStudent(s.id, { status: StudentStatus.AT_SCHOOL });
        }
      });
      db.updateRoute(myRoute.id, { status: ShuttleStatus.ARRIVED_AT_SCHOOL });
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const studentToAdd: Student = { 
      id: db.generateId(),
      name: newStudent.name, 
      className: newStudent.className, 
      batch: newStudent.batch, 
      address: newStudent.address, 
      parentName: newStudent.parentName, 
      status: StudentStatus.AT_HOME, 
      isPaid: false, 
      feeType: 'NORMAL' 
    };
    
    const currentStudents = db.getStudents();
    const updatedStudents = [...currentStudents, studentToAdd];
    localStorage.setItem('kidgo_db_students', JSON.stringify(updatedStudents));
    db.updateRoute(myRoute.id, { students: updatedStudents });
    setIsAddingStudent(false);
    setNewStudent({ name: '', className: '', batch: '1', address: '', parentName: '' });
  };

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    db.updateStudent(editingStudent.id, {
      name: editingStudent.name,
      className: editingStudent.className,
      batch: editingStudent.batch,
      address: editingStudent.address,
      parentName: editingStudent.parentName
    });
    
    setEditingStudent(null);
  };

  const filteredStudents = myRoute.students ? myRoute.students.filter(s => s.batch === activeBatch) : [];
  const totalCollected = myRoute.students ? myRoute.students.reduce((acc, s) => s.isPaid ? acc + FEES[s.feeType] : acc, 0) : 0;
  const notificationStudents = myRoute.students ? myRoute.students.filter(s => [StudentStatus.ABSENT, StudentStatus.LATE_WAKE_UP, StudentStatus.WAITING].includes(s.status)) : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Emergency Alert Banner */}
      <div className="bg-red-50 border-2 border-red-100 p-4 rounded-3xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-xl animate-pulse"><Truck size={20} /></div>
          <div><h5 className="text-[10px] font-black text-red-800 uppercase tracking-widest leading-none">Pusat Kendala</h5><p className="text-xs text-red-600 font-medium">Ada masalah dengan armada?</p></div>
        </div>
        <button onClick={() => setShowEmergencyPanel(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase shadow-lg shadow-red-200 hover:bg-red-700 transition-all">LAPOR KENDALA</button>
      </div>

      {/* Modal Edit Siswa */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Edit2 size={24} /></div>
                <h3 className="text-xl font-black text-slate-900">Edit Data Siswa</h3>
              </div>
              <button onClick={() => setEditingStudent(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nama Lengkap</label>
                  <input type="text" value={editingStudent.name} required className="w-full px-4 py-3 border rounded-xl outline-none focus:border-indigo-500 font-bold" onChange={e => setEditingStudent({...editingStudent, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Kelas</label>
                  <input type="text" value={editingStudent.className} required className="w-full px-4 py-3 border rounded-xl outline-none focus:border-indigo-500 font-bold" onChange={e => setEditingStudent({...editingStudent, className: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Kloter</label>
                  <select className="w-full px-4 py-3 border rounded-xl bg-white outline-none font-bold" value={editingStudent.batch} onChange={e => setEditingStudent({...editingStudent, batch: e.target.value})}>
                    <option value="1">Kloter 1</option>
                    <option value="2">Kloter 2</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nama Orang Tua</label>
                  <input type="text" value={editingStudent.parentName} required className="w-full px-4 py-3 border rounded-xl outline-none focus:border-indigo-500 font-bold" onChange={e => setEditingStudent({...editingStudent, parentName: e.target.value})} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Alamat Lengkap</label>
                  <textarea rows={2} value={editingStudent.address} required className="w-full px-4 py-3 border rounded-xl outline-none focus:border-indigo-500 font-bold resize-none" onChange={e => setEditingStudent({...editingStudent, address: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                <Save size={18} /> SIMPAN PERUBAHAN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Wallet size={24} /></div>
          <div><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Kas Bulan Ini</p><h4 className="text-2xl font-black text-slate-900 leading-none mt-1">Rp {totalCollected.toLocaleString('id-ID')}</h4></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
           <div className="flex gap-2">
             {['1', '2'].map(num => (
               <button key={num} onClick={() => setActiveBatch(num)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeBatch === num ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>KLOTER {num}</button>
             ))}
           </div>
           {myRoute.status === ShuttleStatus.PICKING_UP && (
             <button onClick={finishRoute} className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all"><CheckCircle size={20} /></button>
           )}
        </div>
      </div>

      {/* Active Notifications */}
      {notificationStudents.length > 0 && (
        <div className="bg-white border-2 border-indigo-100 p-5 rounded-3xl shadow-xl space-y-3 animate-in fade-in slide-in-from-top duration-500">
           <div className="flex items-center gap-2 mb-2"><AlertTriangle className="text-indigo-500" size={18} /><h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Pemberitahuan Orang Tua</h5></div>
           <div className="space-y-2">
            {notificationStudents.map(s => (
              <div key={s.id} className={`flex items-center gap-4 py-3 px-4 rounded-2xl border-2 transition-all ${s.status === StudentStatus.WAITING ? 'bg-emerald-50 border-emerald-200 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`p-2 rounded-xl ${s.status === StudentStatus.ABSENT ? 'bg-red-100 text-red-600' : s.status === StudentStatus.LATE_WAKE_UP ? 'bg-orange-100 text-orange-600' : 'bg-emerald-500 text-white animate-pulse'}`}>
                  {s.status === StudentStatus.ABSENT ? <X size={18} /> : s.status === StudentStatus.LATE_WAKE_UP ? <AlarmClock size={18} /> : <Sparkles size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><p className="text-sm font-bold text-slate-900 truncate">{s.name}</p><span className="text-[9px] font-black bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase shrink-0">Kloter {s.batch}</span></div>
                  <p className={`text-[10px] font-black uppercase tracking-tighter truncate ${s.status === StudentStatus.WAITING ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {s.status === StudentStatus.ABSENT ? 'IZIN TIDAK MASUK' : s.status === StudentStatus.LATE_WAKE_UP ? 'TELAT (ANTAR SENDIRI)' : 'SUDAH SIAP DI DEPAN RUMAH!'}
                  </p>
                </div>
                <button onClick={() => updateStatus(s.id, StudentStatus.AT_HOME)} className="text-[10px] font-black bg-white border border-slate-200 text-slate-400 px-3 py-1.5 rounded-xl hover:text-indigo-600 hover:border-indigo-200 transition-all">OK</button>
              </div>
            ))}
           </div>
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><Layers size={20} className="text-indigo-600" />Daftar Kloter {activeBatch} <span className="text-xs text-slate-400 font-normal">({filteredStudents.length} Siswa)</span></h3>
            <button onClick={() => setIsAddingStudent(!isAddingStudent)} className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-xl uppercase flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm"><Plus size={14} /> Tambah Siswa</button>
          </div>
          
          {isAddingStudent && (
            <div className="mb-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in slide-in-from-top duration-300">
               <div className="flex justify-between items-center mb-4"><h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Input Data Siswa Baru</h4><button onClick={() => setIsAddingStudent(false)}><X size={16} className="text-slate-400" /></button></div>
               <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 <input type="text" placeholder="Nama Lengkap" required className="px-4 py-3 text-sm border rounded-xl outline-none focus:border-indigo-500 sm:col-span-2" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                 <input type="text" placeholder="Kelas" required className="px-4 py-3 text-sm border rounded-xl outline-none focus:border-indigo-500" value={newStudent.className} onChange={e => setNewStudent({...newStudent, className: e.target.value})} />
                 <div className="flex flex-col gap-1 sm:col-span-1"><label className="text-[9px] font-black text-slate-400 ml-1">PILIH KLOTER</label><select className="px-4 py-3 text-sm border rounded-xl bg-white outline-none" value={newStudent.batch} onChange={e => setNewStudent({...newStudent, batch: e.target.value})}><option value="1">Kloter 1</option><option value="2">Kloter 2</option></select></div>
                 <input type="text" placeholder="Nama Orang Tua" required className="px-4 py-3 text-sm border rounded-xl outline-none focus:border-indigo-500 sm:col-span-2 mt-auto" value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} />
                 <input type="text" placeholder="Alamat Penjemputan" required className="px-4 py-3 text-sm border rounded-xl outline-none focus:border-indigo-500 sm:col-span-3" value={newStudent.address} onChange={e => setNewStudent({...newStudent, address: e.target.value})} />
                 <button type="submit" className="bg-indigo-600 text-white font-black py-4 rounded-xl sm:col-span-3 shadow-lg hover:bg-indigo-700 transition-all">DAFTARKAN SISWA</button>
               </form>
            </div>
          )}

          <div className="space-y-4">
            {filteredStudents.length === 0 ? (
              <div className="p-16 text-center border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center gap-3">
                <div className="p-4 bg-slate-50 text-slate-300 rounded-full"><Users size={48} /></div>
                <div><p className="text-slate-400 text-sm font-bold">Belum ada siswa di Kloter {activeBatch}</p></div>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isInactive = [StudentStatus.ABSENT, StudentStatus.LATE_WAKE_UP].includes(student.status);
                const isWaiting = student.status === StudentStatus.WAITING;
                const isAtSchool = student.status === StudentStatus.AT_SCHOOL;
                return (
                  <div key={student.id} className={`group border rounded-3xl overflow-hidden transition-all ${isInactive ? 'opacity-40 grayscale bg-slate-50' : 'bg-white'} ${isAtSchool ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 shadow-sm'}`}>
                    <div className={`flex items-center gap-4 p-5 ${student.status === StudentStatus.ON_BOARD ? 'bg-indigo-50/50' : ''}`}>
                      <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${isWaiting ? 'bg-emerald-500 border-emerald-400 text-white animate-bounce' : 'bg-slate-50 border-slate-200 text-indigo-400'}`}>
                        {isAtSchool ? <CheckCircle2 size={24} className="text-emerald-500" /> : <GraduationCap size={20} />}<span className="text-[9px] font-black mt-0.5">{student.className}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2"><h4 className="font-black text-slate-900 truncate text-lg">{student.name}</h4>{isWaiting && <span className="bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black animate-pulse shadow-sm">SIAP JEMPUT</span>}</div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: <span className="text-indigo-600">{student.id}</span></p>
                      </div>
                      <div className="flex gap-1">
                        {!isInactive && !isAtSchool && (
                          <button onClick={() => updateStatus(student.id, student.status === StudentStatus.ON_BOARD ? StudentStatus.AT_HOME : StudentStatus.ON_BOARD)} className={`px-4 py-3 rounded-2xl text-[10px] font-black transition-all shadow-sm ${student.status === StudentStatus.ON_BOARD ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            {student.status === StudentStatus.ON_BOARD ? 'TURUNKAN' : 'NAIK'}
                          </button>
                        )}
                        <button onClick={() => setEditingStudent(student)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all" title="Edit Siswa"><Edit2 size={20} /></button>
                        <button onClick={() => deleteStudent(student.id, student.name)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all" title="Hapus Siswa"><Trash2 size={20} /></button>
                      </div>
                    </div>
                    <div className="bg-slate-50/50 px-6 py-3 flex flex-wrap items-center justify-between border-t border-slate-100 gap-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => cycleFeeType(student.id, student.feeType)} className={`text-[9px] font-black px-3 py-1.5 rounded-xl border ${student.feeType === 'NORMAL' ? 'bg-white text-blue-600' : student.feeType === 'HOLIDAY' ? 'bg-white text-orange-600' : 'bg-slate-900 text-white'}`}>{student.feeType}</button>
                        <button onClick={() => togglePaymentStatus(student.id, student.isPaid)} className={`text-[10px] font-black ${student.isPaid ? 'text-emerald-600' : 'text-slate-400 underline decoration-dotted'}`}>{student.isPaid ? '✓ LUNAS' : 'TANDAI LUNAS'}</button>
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 italic truncate max-w-[150px]">{student.address}</div>
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
