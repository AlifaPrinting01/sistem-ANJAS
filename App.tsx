
import React, { useState, useEffect } from 'react';
import { UserRole, ShuttleStatus, StudentStatus, ShuttleRoute, Student } from './types';
import { db } from './services/databaseService';
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
  LayoutDashboard,
  AlertTriangle
} from 'lucide-react';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('DASHBOARD'); 
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(false);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState(false);
  const [loggedStudent, setLoggedStudent] = useState<Student | null>(null);
  const [routes, setRoutes] = useState<ShuttleRoute[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [driverAlert, setDriverAlert] = useState<any>(null);

  // Initialize and Sync Data
  useEffect(() => {
    db.init();
    const loadData = () => {
      setRoutes(db.getRoutes());
      setDriverAlert(db.getAlert());
      
      // Update logged student if exists
      if (loggedStudent) {
        const freshStudent = db.getStudents().find(s => s.id === loggedStudent.id);
        if (freshStudent) setLoggedStudent(freshStudent);
      }
    };

    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [loggedStudent?.id]);

  const handleLogout = () => {
    setRole(null);
    setIsParentLoggedIn(false);
    setIsDriverLoggedIn(false);
    setLoggedStudent(null);
    setActiveTab('DASHBOARD');
  };

  const triggerGlobalAlert = (message: string, type: string) => {
    const alertData = { active: true, message, type, timestamp: Date.now() };
    db.setAlert(alertData);
    setDriverAlert(alertData);
    
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("KidGo: INFO PENTING!", { body: message, icon: "/bus-icon.png" });
    }
    window.dispatchEvent(new Event('storage'));
  };

  const updateRouteInDB = (newRoutes: ShuttleRoute[] | ((prev: ShuttleRoute[]) => ShuttleRoute[])) => {
    const updated = typeof newRoutes === 'function' ? newRoutes(routes) : newRoutes;
    setRoutes(updated);
    updated.forEach(r => db.updateRoute(r.id, r));
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-2xl animate-in zoom-in duration-300 relative z-10">
          <div className="text-center">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-100 text-indigo-600 mb-4">
              <Bus size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">KidGo</h2>
            <p className="mt-2 text-sm text-slate-500 font-medium italic">"Database Persisten & Full Course System"</p>
          </div>
          <div className="space-y-4">
            <button onClick={() => { setRole('DRIVER'); setActiveTab('DASHBOARD'); }} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-orange-50 border-2 border-slate-100 hover:border-orange-300 rounded-2xl transition-all group">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors"><Navigation size={24} /></div>
                <div>
                  <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Portal Supir</p>
                  <p className="text-sm text-slate-500 font-medium">Atur Rute & Armada</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => { setRole('PARENT'); setActiveTab('MAIN'); }} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-emerald-50 border-2 border-slate-100 hover:border-emerald-300 rounded-2xl transition-all group">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Users size={24} /></div>
                <div>
                  <p className="font-black text-slate-800 uppercase text-xs tracking-widest">Portal Orang Tua</p>
                  <p className="text-sm text-slate-500 font-medium">Pantau Status Anak</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'DRIVER' && !isDriverLoggedIn) return <DriverAuth onLoginSuccess={() => setIsDriverLoggedIn(true)} onBack={() => setRole(null)} />;
  if (role === 'PARENT' && !isParentLoggedIn) return <ParentAuth students={routes[0]?.students || []} onLoginSuccess={(student) => { setLoggedStudent(student); setIsParentLoggedIn(true); }} onBack={() => setRole(null)} />;

  const currentRoute = routes[0] || {} as ShuttleRoute;
  const currentStudent = loggedStudent || currentRoute.students?.[0];

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD': return <Dashboard routes={routes} setRoutes={updateRouteInDB} />;
      case 'MAIN': return role === 'DRIVER' 
        ? <DriverPortal routes={routes} setRoutes={updateRouteInDB} onTriggerAlert={triggerGlobalAlert} />
        : <ParentPortal student={currentStudent} route={currentRoute} driverAlert={driverAlert} onClearAlert={() => { db.clearAlert(); setDriverAlert(null); }} onReportAbsence={(id, status) => db.updateStudent(id, { status })} />;
      case 'MAP': return <NavigationMap route={currentRoute} role={role} setRoutes={updateRouteInDB} />;
      case 'SETTINGS': return <SettingsPortal 
        role={role} 
        user={role === 'DRIVER' ? { name: currentRoute.driverName, vehicle: currentRoute.vehicleNumber } : { name: currentStudent.parentName, student: currentStudent.name }} 
        onUpdateProfile={(name, vehicle) => role === 'DRIVER' ? db.updateRoute(currentRoute.id, { driverName: name, vehicleNumber: vehicle }) : db.updateStudent(currentStudent.id, { parentName: name })}
      />;
      default: return <Dashboard routes={routes} setRoutes={updateRouteInDB} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {role === 'PARENT' && driverAlert?.active && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white p-4 shadow-2xl animate-in slide-in-from-top duration-500">
           <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 animate-pulse">
                <div className="p-2 bg-white/20 rounded-xl"><AlertTriangle size={24} /></div>
                <div><h4 className="font-black text-sm uppercase tracking-wider">KENDALA ARMADA</h4><p className="text-xs font-medium text-red-100">{driverAlert.message}</p></div>
              </div>
              <button onClick={() => { db.clearAlert(); setDriverAlert(null); }} className="bg-white text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase shadow-lg">MENGERTI</button>
           </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-white transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="p-2 bg-indigo-600 rounded-lg shrink-0 shadow-lg shadow-indigo-600/30"><Bus size={24} /></div>
            {sidebarOpen && <span className="text-xl font-bold tracking-tight">KidGo</span>}
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {role === 'DRIVER' && <SidebarBtn icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} open={sidebarOpen} />}
            <SidebarBtn icon={<Users size={20} />} label={role === 'PARENT' ? 'Status Anak' : 'Daftar Siswa'} active={activeTab === 'MAIN'} onClick={() => setActiveTab('MAIN')} open={sidebarOpen} />
            <SidebarBtn icon={<Navigation size={20} />} label="Peta" active={activeTab === 'MAP'} onClick={() => setActiveTab('MAP')} open={sidebarOpen} />
            <SidebarBtn icon={<Settings size={20} />} label="Pengaturan" active={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')} open={sidebarOpen} />
          </nav>
          <div className="p-4 border-t border-slate-800"><button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"><LogOut size={20} />{sidebarOpen && <span>Keluar</span>}</button></div>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} ${driverAlert?.active && role === 'PARENT' ? 'mt-16' : ''}`}>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center justify-between px-8">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">{sidebarOpen ? <X size={20} /> : <Menu size={20} />}</button>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{role === 'DRIVER' ? 'Supir' : `Wali: ${currentStudent?.name}`}</p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Online Database</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border-2 ${role === 'DRIVER' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}>{role?.[0]}</div>
          </div>
        </header>
        <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">{renderContent()}</div>
      </main>
    </div>
  );
};

const SidebarBtn = ({ icon, label, active, onClick, open }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
    {icon} {open && <span className="font-semibold">{label}</span>}
  </button>
);

export default App;
