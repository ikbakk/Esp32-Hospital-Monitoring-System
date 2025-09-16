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
}
