
import React, { useState } from 'react';
import { ShuttleRoute, ShuttleStatus } from '../types';
import { getSmartRouteAdvice } from '../services/geminiService';
import { 
  Activity, 
  MapPin, 
  AlertCircle, 
  BarChart3, 
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';

interface DashboardProps {
  routes: ShuttleRoute[];
  setRoutes: React.Dispatch<React.SetStateAction<ShuttleRoute[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ routes, setRoutes }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const handleOptimizeRoute = async (routeId: string) => {
    setIsOptimizing(true);
    const route = routes.find(r => r.id === routeId);
    if (!route) return;

    const result = await getSmartRouteAdvice(route.students, "Hujan ringan, jalan raya utama macet di beberapa titik");
    
    if (result) {
      const newStudents = [...route.students].sort((a, b) => {
        return result.optimizedOrder.indexOf(a.id) - result.optimizedOrder.indexOf(b.id);
      });
      
      setRoutes(prev => prev.map(r => r.id === routeId ? { ...r, students: newStudents } : r));
      setAiReport(`Rute dioptimalkan oleh AI: ${result.summary}. Estimasi: ${result.estimatedTotalMinutes} menit.`);
    }
    
    setIsOptimizing(false);
  };

  const activeRoutesCount = routes.filter(r => r.status !== ShuttleStatus.IDLE).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Activity size={24} />} label="Armada Aktif" value={`${activeRoutesCount} / ${routes.length}`} color="indigo" />
        <StatCard icon={<MapPin size={24} />} label="Siswa Terjemput" value="12 / 24" color="emerald" />
        <StatCard icon={<Clock size={24} />} label="Rata-rata Waktu" value="18m" color="orange" />
        <StatCard icon={<AlertCircle size={24} />} label="Insiden" value="0" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Monitoring Armada</h3>
              <button className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            <div className="p-6 space-y-4">
              {routes.map(route => (
                <div key={route.id} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-200 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900">{route.driverName} - {route.vehicleNumber}</h4>
                      <p className="text-xs text-slate-500">Status: <span className="text-indigo-600 font-semibold capitalize">{route.status.replace('_', ' ').toLowerCase()}</span></p>
                    </div>
                    <button 
                      disabled={isOptimizing}
                      onClick={() => handleOptimizeRoute(route.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                      {isOptimizing ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      AI Optimize
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {route.students.map(student => (
                      <div key={student.id} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                        student.status === 'ON_BOARD' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        student.status === 'AT_HOME' ? 'bg-slate-50 border-slate-200 text-slate-600' :
                        'bg-indigo-50 border-indigo-200 text-indigo-700'
                      }`}>
                        {student.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-indigo-400" size={20} />
                  <h3 className="font-bold text-lg">AI Smart Insight</h3>
                </div>
                {isOptimizing ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                    <p className="text-indigo-400 text-sm italic">Menganalisis rute tercepat...</p>
                  </div>
                ) : aiReport ? (
                  <p className="text-slate-300 text-sm leading-relaxed">{aiReport}</p>
                ) : (
                  <p className="text-slate-400 text-sm italic">Klik AI Optimize untuk mendapatkan rekomendasi rute berdasarkan kondisi lalin saat ini.</p>
                )}
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-600" />
              Efisiensi Hari Ini
            </h3>
            <div className="space-y-4">
              <EfficiencyBar label="Kapasitas Kursi" value={75} color="bg-indigo-600" />
              <EfficiencyBar label="Ketepatan Waktu" value={92} color="bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600"
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        </div>
      </div>
    </div>
  );
};

const EfficiencyBar = ({ label, value, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-medium text-slate-600">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
