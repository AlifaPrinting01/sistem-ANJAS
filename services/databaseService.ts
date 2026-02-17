
import { Student, ShuttleRoute, StudentStatus, ShuttleStatus, DriverAccount } from '../types';

const DB_KEYS = {
  STUDENTS: 'kidgo_db_students',
  ROUTES: 'kidgo_db_routes',
  USERS: 'kidgo_db_users', // Tetap ada untuk legacy
  DRIVERS: 'kidgo_db_drivers', // Key baru untuk supir
  ALERTS: 'kidgo_db_alerts'
};

const DEFAULT_STUDENTS: Student[] = [
  { id: 'STD-2025-DEMO1', name: 'Budi Santoso', className: '3-A', batch: '1', address: 'Jl. Melati No. 5', parentName: 'Bp. Santoso', status: StudentStatus.AT_HOME, isPaid: true, feeType: 'NORMAL' },
  { id: 'STD-2025-DEMO2', name: 'Siti Aminah', className: '2-B', batch: '1', address: 'Jl. Mawar No. 12', parentName: 'Ibu Aminah', status: StudentStatus.AT_HOME, isPaid: false, feeType: 'EXTENDED' },
];

const DEFAULT_DRIVER: DriverAccount = {
  email: 'driver@kidgo.com',
  password: '1234',
  name: 'Pak Jajang',
  vehicleNumber: 'B 1234 ABC'
};

const DEFAULT_ROUTE: ShuttleRoute = {
  id: 'R-JAJANG',
  driverEmail: 'driver@kidgo.com',
  driverName: 'Pak Jajang',
  vehicleNumber: 'B 1234 ABC',
  status: ShuttleStatus.IDLE,
  students: DEFAULT_STUDENTS,
  currentLocation: 'Pool Sekolah'
};

export const db = {
  generateId: (): string => {
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const year = new Date().getFullYear();
    return `STD-${year}-${randomStr}`;
  },

  init: () => {
    if (!localStorage.getItem(DB_KEYS.STUDENTS)) {
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem(DB_KEYS.DRIVERS)) {
      localStorage.setItem(DB_KEYS.DRIVERS, JSON.stringify([DEFAULT_DRIVER]));
    }
    if (!localStorage.getItem(DB_KEYS.ROUTES)) {
      localStorage.setItem(DB_KEYS.ROUTES, JSON.stringify([DEFAULT_ROUTE]));
    }
  },

  // Drivers Management
  getDrivers: (): DriverAccount[] => JSON.parse(localStorage.getItem(DB_KEYS.DRIVERS) || '[]'),
  
  addDriver: (driver: DriverAccount) => {
    const drivers = db.getDrivers();
    drivers.push(driver);
    localStorage.setItem(DB_KEYS.DRIVERS, JSON.stringify(drivers));

    // Otomatis buat rute untuk supir baru
    const newRoute: ShuttleRoute = {
      id: `R-${driver.name.replace(/\s+/g, '-').toUpperCase()}`,
      driverEmail: driver.email,
      driverName: driver.name,
      vehicleNumber: driver.vehicleNumber,
      status: ShuttleStatus.IDLE,
      students: [], // Supir baru mulai dengan 0 siswa
      currentLocation: 'Pool Supir'
    };
    const routes = db.getRoutes();
    routes.push(newRoute);
    localStorage.setItem(DB_KEYS.ROUTES, JSON.stringify(routes));
    window.dispatchEvent(new Event('storage'));
  },

  // Students CRUD
  getStudents: (): Student[] => JSON.parse(localStorage.getItem(DB_KEYS.STUDENTS) || '[]'),
  
  updateStudent: (id: string, updates: Partial<Student>) => {
    const students = db.getStudents();
    const updated = students.map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(updated));
    
    // Sync with all routes that contain this student
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
    
    const routes = db.getRoutes();
    const updatedRoutes = routes.map(r => ({
      ...r,
      students: r.students.filter(s => s.id !== id)
    }));
    localStorage.setItem(DB_KEYS.ROUTES, JSON.stringify(updatedRoutes));
    window.dispatchEvent(new Event('storage'));
  },

  // Routes Management
  getRoutes: (): ShuttleRoute[] => JSON.parse(localStorage.getItem(DB_KEYS.ROUTES) || '[]'),
  updateRoute: (id: string, updates: Partial<ShuttleRoute>) => {
    const routes = db.getRoutes();
    const updated = routes.map(r => r.id === id ? { ...r, ...updates } : r);
    localStorage.setItem(DB_KEYS.ROUTES, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  },

  setAlert: (alert: any) => localStorage.setItem(DB_KEYS.ALERTS, JSON.stringify(alert)),
  getAlert: () => JSON.parse(localStorage.getItem(DB_KEYS.ALERTS) || 'null'),
  clearAlert: () => localStorage.removeItem(DB_KEYS.ALERTS)
};
