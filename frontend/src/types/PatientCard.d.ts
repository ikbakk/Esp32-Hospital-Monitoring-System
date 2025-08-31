export type Status = "normal" | "warning" | "critical";

export interface InfoDisplayCardProps {
  title: string;
  status: Status;
}

export interface MockData {
  name: string;
  status: Status;
}

export interface VitalSigns {
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  bloodPressure: { systolic: number; diastolic: number };
  respiratoryRate: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  roomNumber: string;
  bedNumber: string;
  admissionDate: string;
  condition: "normal" | "warning" | "critical";
  vitals: VitalSigns;
}
