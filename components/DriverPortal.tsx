
import React, { useState } from 'react';
import { ShuttleRoute, ShuttleStatus, StudentStatus, Student } from '../types';
import { 
  Play, 
  CheckCircle2, 
  MapPin, 
  Phone,
  Wallet,
  UserPlus,
  X,
  Plus,
  Fingerprint
} from 'lucide-react';

interface DriverPortalProps {
  routes: ShuttleRoute[];
  setRoutes: React.Dispatch<React.SetStateAction<ShuttleRoute[]>>;
}

const DriverPortal: React.FC<DriverPortalProps> = ({ routes, setRoutes }) => {
  const myRoute = routes[0];
  const monthlyFee = 200000;

  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    address: '',
    parentName: ''
  });

  const toggleStudentOnBoard = (studentId: string) => {
    setRoutes(prev => prev.map(route => ({
      ...route,
      students: route.students.map(s => 
        s.id === studentId 
          ? { ...s, status: s.status === StudentStatus.ON_BOARD ? StudentStatus.AT_HOME : StudentStatus.ON_BOARD } 
          : s
      )
    })));
  };

  const togglePaymentStatus = (studentId: string) => {
    setRoutes(prev => prev.map(route => ({
      ...route,
      students: route.students.map(s => 
        s.id === studentId 
          ? { ...s, isPaid: !s.isPaid } 
          : s
      )
    })));
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const studentToAdd: Student = {
      id: (Date.now() % 10000).toString(),
      name: newStudent.name,
      address: newStudent.address,
      parentName: newStudent.parentName,
      status: StudentStatus.AT_HOME,
      isPaid: false
    };

    setRoutes(prev => prev.map(route => ({
      ...route,
      students: [...route.students, studentToAdd]
    })));

    setNewStudent({ name: '', address: '', parentName: '' });
    setIsAddingStudent(false);
  };

  const paidCount = myRoute.students.filter(s => s.isPaid).length;
  const totalCollected = paidCount * monthlyFee;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Kas Bulan Ini</p>
            <h4 className="text-2xl font-black text-slate-900 leading-none mt-1">Rp {totalCollected.toLocaleString('id-ID')}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Kapasitas</p>
             <h4 className="text-2xl font-black text-slate-900 leading-none mt-1">{myRoute.students.length} / 12</h4>
           </div>
           <button onClick={() => setIsAddingStudent(true)} className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-110 transition-transform">
             <UserPlus size={20} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {isAddingStudent && (
          <div className="p-8 bg-slate-50 border-b border-slate-200 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" /> Tambah Siswa Baru
              </h3>
              <button onClick={() => setIsAddingStudent(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none text-sm" placeholder="Nama Siswa" />
                <input type="text" required value={newStudent.parentName} onChange={e => setNewStudent({...newStudent, parentName: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none text-sm" placeholder="Nama Orang Tua" />
              </div>
              <input type="text" required value={newStudent.address} onChange={e => setNewStudent({...newStudent, address: e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 outline-none text-sm" placeholder="Alamat Jemput" />
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg">SIMPAN DATA SISWA</button>
            </form>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Daftar Penumpang</h3>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Update: Real-time</span>
          </div>
          <div className="space-y-4">
            {myRoute.students.map((student) => (
              <div key={student.id} className="group border border-slate-100 rounded-3xl overflow-hidden transition-all hover:border-indigo-200 hover:shadow-md">
                <div className={`flex items-center gap-4 p-4 ${student.status === StudentStatus.ON_BOARD ? 'bg-indigo-50/50' : 'bg-white'}`}>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex flex-col items-center justify-center border-2 border-slate-200 transition-colors">
                    <Fingerprint size={16} className="text-indigo-500 mb-0.5" />
                    <span className="text-[10px] font-black text-slate-900">{student.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{student.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold truncate">LOKASI: {student.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleStudentOnBoard(student.id)} className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${student.status === StudentStatus.ON_BOARD ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {student.status === StudentStatus.ON_BOARD ? 'ON BOARD' : 'JEMPUT'}
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 px-5 py-2 flex items-center justify-between border-t border-slate-100">
                   {student.isPaid ? (
                     <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> LUNAS</span>
                   ) : (
                     <span className="text-[10px] font-black text-amber-600 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div> BELUM BAYAR</span>
                   )}
                   <button onClick={() => togglePaymentStatus(student.id)} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-tighter">
                     {student.isPaid ? 'Reset Status' : 'Tandai Lunas'}
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverPortal;
