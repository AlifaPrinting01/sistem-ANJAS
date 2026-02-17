
export type UserRole = 'DRIVER' | 'PARENT';

export enum ShuttleStatus {
  IDLE = 'IDLE',
  PICKING_UP = 'PICKING_UP',
  ARRIVED_AT_SCHOOL = 'ARRIVED_AT_SCHOOL',
  DROPPING_OFF = 'DROPPING_OFF',
  COMPLETED = 'COMPLETED'
}

export enum StudentStatus {
  AT_HOME = 'AT_HOME',
  WAITING = 'WAITING',
  ON_BOARD = 'ON_BOARD',
  AT_SCHOOL = 'AT_SCHOOL',
  PICKED_UP_FROM_SCHOOL = 'PICKED_UP_FROM_SCHOOL',
  ABSENT = 'ABSENT',
  LATE_WAKE_UP = 'LATE_WAKE_UP'
}

export type MonthlyFeeType = 'NORMAL' | 'HOLIDAY' | 'EXTENDED';

export interface Student {
  id: string;
  name: string;
  className: string; // Tambahan: Kelas
  batch: string;     // Tambahan: Kloter (misal: "1" atau "2")
  address: string;
  parentName: string;
  status: StudentStatus;
  isPaid: boolean;
  feeType: MonthlyFeeType;
  pickupTime?: string;
}

export interface ParentAccount {
  email: string;
  password?: string;
  studentId: string;
}

export interface ShuttleRoute {
  id: string;
  driverName: string;
  vehicleNumber: string;
  status: ShuttleStatus;
  students: Student[];
  currentLocation?: string;
}
