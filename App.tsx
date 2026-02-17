
import React, { useState } from 'react';
import { UserRole, ShuttleStatus, StudentStatus, ShuttleRoute, Student, MonthlyFeeType } from './types';
import DriverPortal from './components/DriverPortal';
import ParentPortal from './components/ParentPortal';
import ParentAuth from './components/ParentAuth';
import DriverAuth from './components/DriverAuth';
import NavigationMap from './components/NavigationMap';
import SettingsPortal from './components/SettingsPortal';
import Dashboard from './components/Dashboard';
import { 
  Bus, 
  Users, 
  Navigation, 
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Budi Santoso', className: '3-A', batch: '1', address: 'Jl. Melati No. 5', parentName: 'Bp. Santoso', status: StudentStatus.AT_HOME, isPaid: true, feeType: 'NORMAL' },
  { id: '2', name: 'Siti Aminah', className: '2-B', batch: '1', address: 'Jl. Mawar No. 12', parentName: 'Ibu Aminah', status: StudentStatus.AT_HOME, isPaid: false, feeType: 'EXTENDED' },
  { id: '3', name: 'Andi Wijaya', className: '4-C', batch: '2', address: 'Komp. Hijau B3', parentName: 'Bp. Wijaya', status: StudentStatus.AT_HOME, isPaid: true, feeType: 'HOLIDAY' },
  { id: '4', name: 'Lani Putri', className: '1-A', batch: '2', address: 'Jl. Kenanga No. 8', parentName: 'Ibu Lani', status: StudentStatus.AT_HOME, isPaid: false, feeType: 'NORMAL' },
];

const INITIAL_ROUTES: ShuttleRoute[] = [
  {
    id: 'R1',
    driverName: 'Pak Jajang',
    vehicleNumber: 'B 1234 ABC',
    status: ShuttleStatus.IDLE,
    students: INITIAL_STUDENTS,
    currentLocation: 'Pool Sekolah'
  }
];

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); 
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState(false);
  const [loggedStudent, setLoggedStudent] = useState<Student | null>(null);
  const [routes, setRoutes] = useState<ShuttleRoute[]>(INITIAL_ROUTES);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    setRole(null);
    setIsParentLoggedIn(false);
    setIsDriverLoggedIn(false);
    setLoggedStudent(null);
    setActiveTab('DASHBOARD');
  };

  const updateStudentData = (studentId: string, updates: Partial<Student>) => {
    setRoutes(prev => prev.map(route => ({
      ...route,
      students: route.students.map(s => s.id === studentId ? { ...s, ...updates } : s)
    })));
    // Jika orang tua yang sedang login mengupdate datanya sendiri
    if (loggedStudent && loggedStudent.id === studentId) {
      setLoggedStudent(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl animate-in zoom-in duration-300">
          <div className="text-center">
            <div className="inline-flex p-3 rounded-xl bg-indigo-100 text-indigo-600 mb-4">
              <Bus size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">KidGo</h2>
            <p className="mt-2 text-sm text-gray-600">Sistem Antar Jemput Pintar & Aman</p>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => { setRole('DRIVER'); setActiveTab('DASHBOARD'); }}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Navigation size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Driver (Supir)</p>
                  <p className="text-xs text-slate-500">Mulai Tugas & Navigasi</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => { setRole('PARENT'); setActiveTab('MAIN'); }}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Users size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Orang Tua</p>
                  <p className="text-xs text-slate-500">Pantau Lokasi Anak</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'DRIVER' && !isDriverLoggedIn) {
    return <DriverAuth onLoginSuccess={() => setIsDriverLoggedIn(true)} onBack={() => setRole(null)} />;
  }

  if (role === 'PARENT' && !isParentLoggedIn) {
    return (
      <ParentAuth 
        students={routes[0].students} 
        onLoginSuccess={(student) => {
          setLoggedStudent(student);
          setIsParentLoggedIn(true);
        }}
        onBack={() => setRole(null)}
      />
    );
  }

  const currentStudent = loggedStudent || routes[0].students[0];

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <Dashboard routes={routes} setRoutes={setRoutes} />;
      case 'MAIN':
        return role === 'DRIVER' 
          ? <DriverPortal routes={routes} setRoutes={setRoutes} />
          : <ParentPortal 
              student={currentStudent} 
              route={routes[0]} 
              onReportAbsence={(id, status) => updateStudentData(id, { status })} 
            />;
      case 'MAP':
        return <NavigationMap route={routes[0]} role={role} setRoutes={setRoutes} />;
      case 'SETTINGS':
        return <SettingsPortal role={role} user={role === 'DRIVER' ? { name: routes[0].driverName } : { name: currentStudent.parentName, student: currentStudent.name }} />;
      default:
        return <Dashboard routes={routes} setRoutes={setRoutes} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="p-2 bg-indigo-600 rounded-lg shrink-0 shadow-lg shadow-indigo-600/30">
              <Bus size={24} />
            </div>
            {sidebarOpen && <span className="text-xl font-bold tracking-tight">KidGo</span>}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {role === 'DRIVER' && (
              <button 
                onClick={() => setActiveTab('DASHBOARD')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'DASHBOARD' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                <LayoutDashboard size={20} />
                {sidebarOpen && <span className="font-semibold">Dashboard</span>}
              </button>
            )}
            
            <button 
              onClick={() => setActiveTab('MAIN')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'MAIN' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Users size={20} />
              {sidebarOpen && <span className="font-semibold">{role === 'PARENT' ? 'Status Anak' : 'Daftar Siswa'}</span>}
            </button>

            <button 
              onClick={() => setActiveTab('MAP')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'MAP' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Navigation size={20} />
              {sidebarOpen && <span className="font-semibold">{role === 'DRIVER' ? 'Rute Navigasi' : 'Peta Armada'}</span>}
            </button>

            <button 
              onClick={() => setActiveTab('SETTINGS')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'SETTINGS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Settings size={20} />
              {sidebarOpen && <span className="font-semibold">Pengaturan</span>}
            </button>
          </nav>

          <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
              <LogOut size={20} />
              {sidebarOpen && <span>Keluar</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center justify-between px-8">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{role === 'DRIVER' ? 'Supir Armada' : `Orang Tua: ${currentStudent.name}`}</p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{activeTab.replace('_', ' ')}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border-2 ${role === 'DRIVER' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}>
              {role?.[0]}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
