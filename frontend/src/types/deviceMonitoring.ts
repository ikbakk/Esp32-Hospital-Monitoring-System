export interface DeviceReading {
  id: string;
  vitalSigns: VitalSigns;
  deviceStatus: "active" | "inactive" | "maintenance";
  timestamp: Date;
}

export interface Device {
  id: string;
  deviceStatus: "active" | "inactive" | "maintenance";
  vitalSigns: VitalSigns;
  location: Location;
}

export interface Location {
  roomNumber: string;
  bedNumber: string;
}

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

export interface AlertSummary {
  deviceId: string;
  patientId: string;
  activeAlerts: {
    hrAlert: boolean;
    spo2Alert: boolean;
    tempAlert: boolean;
  };
  alertCount: number;
  lastAlertTime: Date;
}

export interface ReadingFilters {
  deviceId?: string;
  patientId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasAlerts?: boolean;
  dataQuality?: "good" | "fair" | "poor";
}

export interface PaginationOptions {
  limit: number;
  lastDoc?: any; // Firestore DocumentSnapshot
}
