import { Timestamp } from "firebase/firestore";

export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  admissionDate: string;
}

export interface PatientReadings {
  heartRate: number;
  spo2: number;
  bodyTemp: number;
  timestamp: string;
}
