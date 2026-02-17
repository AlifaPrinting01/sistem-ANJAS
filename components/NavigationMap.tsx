
import React from 'react';
import { ShuttleRoute, ShuttleStatus, UserRole } from '../types';
import { MapPin, Bus, Flag, Navigation, Activity } from 'lucide-react';

interface NavigationMapProps {
  route: ShuttleRoute;
  role: UserRole;
  setRoutes: any;
}

const NavigationMap: React.FC<NavigationMapProps> = ({ route, role, setRoutes }) => {
  const isEnRoute = route.status !== ShuttleStatus.IDLE;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Peta Navigasi</h2>
            <p className="text-slate-500 text-sm italic">{isEnRoute ? 'Sedang memantau pergerakan armada secara real-time...' : 'Armada sedang parkir di pool.'}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm border border-indigo-100">
             <Activity size={16} className={isEnRoute ? 'animate-pulse' : ''} />
             Live Sync Active
          </div>
        </div>

        {/* Visual Map Simulation */}
        <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner group">
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
          
          {/* Waypoints */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-200">
                <MapPin className="text-red-500" />
              </div>
              <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap text-slate-600 uppercase">Titik Jemput 1</p>
            </div>
          </div>

          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 -translate-y-1/2">
             <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-200">
                <Flag className="text-emerald-600" />
              </div>
              <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap text-slate-600 uppercase">Sekolah (Tujuan)</p>
            </div>
          </div>

          {/* Bus Icon Simulation */}
          <div 
            className={`absolute top-1/2 left-1/2 transition-all duration-1000 flex flex-col items-center ${
              isEnRoute ? 'animate-bounce translate-x-4' : 'opacity-80'
            }`}
          >
            <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-xl shadow-indigo-600/40 relative">
              <Bus size={32} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="mt-2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg">
              {route.vehicleNumber}
            </div>
          </div>

          {/* Route Line Simulation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M 25 50 Q 50 50 75 75" fill="none" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2,2" />
          </svg>

          {/* Map Controls */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 text-slate-600"><Navigation size={20} /></button>
          </div>
        </div>

        {/* Info Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
           <MapStat label="Status" value={route.status.replace('_', ' ')} color="text-indigo-600" />
           <MapStat label="Kecepatan" value={isEnRoute ? "32 km/h" : "0 km/h"} color="text-slate-900" />
           <MapStat label="Penumpang" value={`${route.students.filter(s => s.status === 'ON_BOARD').length} Siswa`} color="text-emerald-600" />
           <MapStat label="Lokasi Saat Ini" value={isEnRoute ? "Jl. Gatot Subroto" : "Pool Sekolah"} color="text-slate-900" />
        </div>
      </div>

      {role === 'DRIVER' && route.status === ShuttleStatus.IDLE && (
        <div className="bg-indigo-600 p-8 rounded-3xl text-white text-center shadow-xl shadow-indigo-600/20">
          <h3 className="text-xl font-bold mb-2">Siap untuk tugas berikutnya?</h3>
          <p className="text-indigo-100 text-sm mb-6 max-w-sm mx-auto">Mulai perjalanan untuk mengaktifkan pelacakan real-time bagi orang tua.</p>
          <button 
            onClick={() => setRoutes((prev: any) => prev.map((r: any) => r.id === route.id ? {...r, status: ShuttleStatus.PICKING_UP} : r))}
            className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
          >
            AKTIFKAN RUTE SEKARANG
          </button>
        </div>
      )}
    </div>
  );
};

const MapStat = ({ label, value, color }: any) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
    <p className={`font-bold text-sm ${color}`}>{value}</p>
  </div>
);

export default NavigationMap;
