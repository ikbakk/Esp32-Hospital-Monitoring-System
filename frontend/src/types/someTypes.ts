// ===== types/medical-records.ts =====
export interface MedicalHistory {
  condition: string;
  diagnosedDate: string;
  status: "active" | "resolved" | "chronic";
  notes: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  prescribedBy: string;
  status: "active" | "discontinued";
}

export interface Allergy {
  allergen: string;
  severity: "mild" | "moderate" | "severe";
  reaction: string;
  discoveredDate: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  roomNumber: string;
  bedNumber: string;
  admissionDate: string;
  condition: "normal" | "warning" | "critical";
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  medicalHistory: MedicalHistory[];
  currentMedications: Medication[];
  allergies: Allergy[];
  carePlan: string;
  attendingPhysician: string;
  assignedNurse: string;
  insurance: string;
  bloodType: string;
  // Monitoring integration
  assignedDevices: string[];
  monitoringStatus: "active" | "paused" | "discontinued";
  createdAt: Date;
  updatedAt: Date;
}

// ===== types/device-monitoring.ts =====
export interface VitalSigns {
  heartRate: {
    alert: {
      status: "warning" | "critical" | "none";
      warningCount: number;
      criticalCount: number;
    };
    value: number;
  };
  spo2: {
    alert: {
      status: "warning" | "critical" | "none";
      warningCount: number;
      criticalCount: number;
    };
    value: number;
  };
  bodyTemp: {
    alert: {
      status: "warning" | "critical" | "none";
      warningCount: number;
      criticalCount: number;
    };
    value: number;
  };
}

export interface DeviceReading {
  id: string;
  vitalSigns: VitalSigns;
  timestamp: Date;
}

export interface Device {
  id: string;
  deviceStatus: "active" | "inactive" | "maintenance";
  location: {
    roomNumber: string;
    bedNumber: string;
  };
}

export interface AlertSummary {
  patientName?: string;
  roomNumber?: string;
  activeAlerts: {
    heartRate: "warning" | "critical" | "none";
    spo2: "warning" | "critical" | "none";
    bodyTemp: "warning" | "critical" | "none";
  };
  alertCount: number;
  lastAlertTime: Date;
  severity: "low" | "medium" | "high";
}

// Combined types
export interface PatientWithDevices extends PatientRecord {
  devices: Device[];
  latestReadings: DeviceReading[];
  activeAlerts: number;
}

export interface RoomStatus {
  roomNumber: string;
  patients: PatientRecord[];
  devices: Device[];
  activeAlerts: number;
  totalReadings: number;
}

// Filter types
export interface ReadingFilters {
  roomNumber?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasAlerts?: boolean;
  patientCondition?: "normal" | "warning" | "critical";
  alertStatus?: "warning" | "critical" | "none";
}

export interface PatientFilters {
  condition?: "normal" | "warning" | "critical";
  roomNumber?: string;
  attendingPhysician?: string;
  assignedNurse?: string;
  hasActiveMonitoring?: boolean;
  bloodType?: string;
}

export interface PaginationOptions {
  limit: number;
  lastDoc?: any;
}
