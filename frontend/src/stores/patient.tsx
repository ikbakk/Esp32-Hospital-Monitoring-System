import { create } from "zustand";
import type { PatientRecord } from "@/types/PatientRecord";

interface PatientStore {
  patients: PatientRecord[];
  setPatients: (list: PatientRecord[]) => void;

  normalPatients: PatientRecord[];
  warningPatients: PatientRecord[];
  criticalPatients: PatientRecord[];
}

export const patientStore = create<PatientStore>((set, get) => ({
  patients: [],
  setPatients: (list) => set({ patients: list }),

  get normalPatients() {
    return get().patients.filter((p) => p.condition === "normal");
  },
  get warningPatients() {
    return get().patients.filter((p) => p.condition === "warning");
  },
  get criticalPatients() {
    return get().patients.filter((p) => p.condition === "critical");
  },
}));
