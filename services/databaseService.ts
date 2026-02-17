
import { Student, ShuttleRoute, StudentStatus, ShuttleStatus } from '../types';

const DB_KEYS = {
  STUDENTS: 'kidgo_db_students',
  ROUTES: 'kidgo_db_routes',
  USERS: 'kidgo_db_users',
  ALERTS: 'kidgo_db_alerts'
};

const DEFAULT_STUDENTS: Student[] = [
  { id: '1', name: 'Budi Santoso', className: '3-A', batch: '1', address: 'Jl. Melati No. 5', parentName: 'Bp. Santoso', status: StudentStatus.AT_HOME, isPaid: true, feeType: 'NORMAL' },
  { id: '2', name: 'Siti Aminah', className: '2-B', batch: '1', address: 'Jl. Mawar No. 12', parentName: 'Ibu Aminah', status: StudentStatus.AT_HOME, isPaid: false, feeType: 'EXTENDED' },
  { id: '3', name: 'Andi Wijaya', className: '4-C', batch: '2', address: 'Komp. Hijau B3', parentName: 'Bp. Wijaya', status: StudentStatus.AT_HOME, isPaid: true, feeType: 'HOLIDAY' },
  { id: '4', name: 'Lani Putri', className: '1-A', batch: '2', address: 'Jl. Kenanga No. 8', parentName: 'Ibu Lani', status: StudentStatus.AT_HOME, isPaid: false, feeType: 'NORMAL' },
];

const DEFAULT_ROUTE: ShuttleRoute = {
  id: 'R1',
  driverName: 'Pak Jajang',
  vehicleNumber: 'B 1234 ABC',
  status: ShuttleStatus.IDLE,
  students: DEFAULT_STUDENTS,
  currentLocation: 'Pool Sekolah'
};

export const db = {
  // Initialize DB with default data if empty (Bisa dikosongkan untuk versi produksi murni)
  init: () => {
    if (!localStorage.getItem(DB_KEYS.STUDENTS)) {
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem(DB_KEYS.ROUTES)) {
      localStorage.setItem(DB_KEYS.ROUTES, JSON.stringify([DEFAULT_ROUTE]));
    }
  },

  // Students CRUD
  getStudents: (): Student[] => JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS) || '[]'),
  
  updateStudent: (id: string, updates: Partial<Student>) => {
    const students = db.getStudents();
    const updated = students.map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(updated));
    
    // Sync with Route
    const routes = db.getRoutes();
    const updatedRoutes = routes.map(r => ({
      ...r,
      students: r.students.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
    localStorage.setItem(DB_KEYS.ROUTES, JSON.stringify(updatedRoutes));
    window.dispatchEvent(new Event('storage'));
  },

  deleteStudent: (id: string) => {
    const students = db.getStudents().filter(s => s.id !== id);
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
    
    // Sync with Route (Remove student from route)
    const routes = db.getRoutes();
    const updatedRoutes = routes.map(r => ({
      ...r,
      students: r.students.filter(s => s.id !== id)
    }));
    localStorage.setItem(DB_KEYS.ROUTES, JSON.stringify(updatedRoutes));
    window.dispatchEvent(new Event('storage'));
  },

  // Routes CRUD
  getRoutes: (): ShuttleRoute[] => JSON.parse(localStorage.getItem(DB_KEYS.ROUTES) || '[]'),
  updateRoute: (id: string, updates: Partial<ShuttleRoute>) => {
    const routes = db.getRoutes();
    const updated = routes.map(r => r.id === id ? { ...r, ...updates } : r);
    localStorage.setItem(DB_KEYS.ROUTES, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  },

  // Alert System
  setAlert: (alert: any) => localStorage.setItem(DB_KEYS.ALERTS, JSON.stringify(alert)),
  getAlert: () => JSON.parse(localStorage.getItem(DB_KEYS.ALERTS) || 'null'),
  clearAlert: () => localStorage.removeItem(DB_KEYS.ALERTS)
};
